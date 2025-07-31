import { NextRequest, NextResponse } from 'next/server';
import Airtable from 'airtable';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';

// Initialize Airtable
const base = new Airtable({
  apiKey: process.env.AIRTABLE_PAT,
}).base(process.env.AIRTABLE_BASE_ID || '');

// Initialize OpenRouter client (using OpenAI SDK)
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': 'https://kap-numerique.re',
    'X-Title': 'Kap Numérique Chatbot',
  },
});

interface ChatRequest {
  message: string;
  sessionId?: string;
}

interface ChatResponse {
  response: string;
  sessionId: string;
}

interface FAQRecord {
  id: string;
  fields: {
    Question: string;
    Reponse: string;
    Categorie?: string;
    Active?: boolean;
  };
}

// Cache for FAQ data
let faqCache: FAQRecord[] = [];
let faqCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function getFAQData(): Promise<FAQRecord[]> {
  const now = Date.now();
  
  // Return cached data if still valid
  if (faqCache.length > 0 && now - faqCacheTime < CACHE_DURATION) {
    return faqCache;
  }

  try {
    // Fetch fresh data from Airtable
    const records: FAQRecord[] = [];
    await base('FAQ')
      .select({
        filterByFormula: '{Active} = TRUE()',
        fields: ['Question', 'Reponse', 'Categorie'],
      })
      .eachPage((pageRecords, fetchNextPage) => {
        pageRecords.forEach((record) => {
          records.push({
            id: record.id,
            fields: {
              Question: record.get('Question') as string,
              Reponse: record.get('Reponse') as string,
              Categorie: record.get('Categorie') as string,
              Active: record.get('Active') as boolean,
            },
          });
        });
        fetchNextPage();
      });

    // Update cache
    faqCache = records;
    faqCacheTime = now;

    return records;
  } catch (error) {
    console.error('Error fetching FAQ data:', error);
    // Return cached data even if expired, as fallback
    return faqCache;
  }
}

function buildPrompt(faqData: FAQRecord[], userMessage: string): string {
  const faqText = faqData
    .map((record) => `Q: ${record.fields.Question}\nR: ${record.fields.Reponse}`)
    .join('\n\n');

  return `Tu es l'assistant virtuel de Kap Numérique, une agence digitale à La Réunion spécialisée dans la transformation numérique des entreprises.

Base de connaissances FAQ:
${faqText}

Instructions importantes:
- Réponds en français de manière naturelle et conversationnelle
- Sois professionnel mais chaleureux (utilise le tutoiement)
- Si la question concerne un sujet dans la FAQ, utilise ces informations mais reformule naturellement
- Si tu ne connais pas la réponse, propose poliment de mettre en contact avec l'équipe
- Mets l'accent sur la subvention Kap Numérique qui finance 80% des projets
- Sois concis mais informatif
- N'hésite pas à poser des questions pour mieux comprendre les besoins

Question de l'utilisateur: ${userMessage}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ChatRequest;
    const { message, sessionId = uuidv4() } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get FAQ data
    const faqData = await getFAQData();

    // Build prompt with context
    const prompt = buildPrompt(faqData, message);

    // Call OpenRouter API
    const completion = await openai.chat.completions.create({
      model: process.env.OPENROUTER_MODEL || 'openai/gpt-4.1-nano',
      messages: [
        {
          role: 'system',
          content: 'Tu es un assistant professionnel et amical.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || 
      "Désolé, je n'ai pas pu générer une réponse. Peux-tu reformuler ta question ?";

    // Generate message ID
    const messageId = uuidv4();

    // Save conversation to Airtable (non-blocking)
    base('Conversations').create([
      {
        fields: {
          MessageID: messageId,
          SessionID: sessionId,
          UserMessage: message,
          BotResponse: response,
          Timestamp: new Date().toISOString(),
        },
      },
    ]).catch((error) => {
      console.error('Error saving conversation:', error);
      // Don't throw - we still want to return the response to the user
    });

    const result: ChatResponse = {
      response,
      sessionId,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Chatbot API error:', error);
    
    // Check if it's an OpenRouter API error
    if (error instanceof Error && error.message.includes('401')) {
      return NextResponse.json(
        { error: 'Configuration error. Please check API keys.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Une erreur est survenue. Veuillez réessayer.' },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint for testing
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Chatbot API is running',
  });
}