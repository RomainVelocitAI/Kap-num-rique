import { NextRequest, NextResponse } from 'next/server';
import Airtable from 'airtable';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';
import { getOrCreateSession, saveSession } from '@/lib/session';

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
  consentGiven?: boolean;
}

interface ChatResponse {
  response: string;
  sessionId: string;
  requiresConsent?: boolean;
}

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: string;
}

interface ConversationData {
  messages: Message[];
  metadata: {
    startTime: string;
    lastActivity: string;
    messageCount: number;
  };
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

function buildPrompt(faqData: FAQRecord[], userMessage: string, previousMessages?: Message[]): string {
  const faqText = faqData
    .map((record) => `Q: ${record.fields.Question}\nR: ${record.fields.Reponse}`)
    .join('\n\n');

  // Construire l'historique de conversation
  let conversationHistory = '';
  if (previousMessages && previousMessages.length > 0) {
    // Prendre les 5 derniers messages pour le contexte
    const recentMessages = previousMessages.slice(-5);
    conversationHistory = '\nHistorique de la conversation:\n' + 
      recentMessages.map(msg => `${msg.type === 'user' ? 'Utilisateur' : 'Assistant'}: ${msg.content}`).join('\n') + '\n\n';
  }

  return `Tu es l'assistant virtuel de Kap Numérique, une agence digitale à La Réunion spécialisée dans la transformation numérique des entreprises.

Base de connaissances FAQ:
${faqText}
${conversationHistory}
Instructions importantes:
- Réponds en français de manière naturelle et conversationnelle
- Sois professionnel mais chaleureux (utilise le tutoiement)
- Si la question concerne un sujet dans la FAQ, utilise ces informations mais reformule naturellement
- Si tu ne connais pas la réponse, propose poliment de mettre en contact avec l'équipe
- Mets l'accent sur la subvention Kap Numérique qui finance 80% des projets
- Sois concis mais informatif
- N'hésite pas à poser des questions pour mieux comprendre les besoins
- Tiens compte de l'historique de la conversation si présent

Question de l'utilisateur: ${userMessage}`;
}

async function getOrCreateConversation(sessionId: string): Promise<{ recordId: string | null; data: ConversationData }> {
  try {
    // Chercher une conversation existante pour cette session
    const records = await base('Conversations')
      .select({
        filterByFormula: `{SessionID} = '${sessionId}'`,
        maxRecords: 1,
        fields: ['SessionID', 'Messages', 'Metadata'],
      })
      .firstPage();

    if (records.length > 0) {
      const record = records[0];
      const messagesField = record.get('Messages');
      const metadataField = record.get('Metadata');

      // Parser les données JSON
      const messages = messagesField ? JSON.parse(messagesField as string) : [];
      const metadata = metadataField ? JSON.parse(metadataField as string) : {
        startTime: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        messageCount: 0,
      };

      return {
        recordId: record.id,
        data: { messages, metadata },
      };
    }

    // Pas de conversation existante
    return {
      recordId: null,
      data: {
        messages: [],
        metadata: {
          startTime: new Date().toISOString(),
          lastActivity: new Date().toISOString(),
          messageCount: 0,
        },
      },
    };
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return {
      recordId: null,
      data: {
        messages: [],
        metadata: {
          startTime: new Date().toISOString(),
          lastActivity: new Date().toISOString(),
          messageCount: 0,
        },
      },
    };
  }
}

async function saveConversation(
  sessionId: string,
  recordId: string | null,
  conversationData: ConversationData
): Promise<void> {
  try {
    // Formater les messages pour une meilleure lisibilité
    const formattedConversation = conversationData.messages
      .map((msg, index) => {
        const time = new Date(msg.timestamp).toLocaleString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        return `[${time}] ${msg.type === 'user' ? '👤 Client' : '🤖 Assistant'}:\n${msg.content}`;
      })
      .join('\n\n---\n\n');

    // Créer un résumé de la conversation
    const lastUserMessage = conversationData.messages
      .filter(m => m.type === 'user')
      .pop();
    const conversationSummary = lastUserMessage 
      ? `Dernière question: "${lastUserMessage.content.substring(0, 100)}${lastUserMessage.content.length > 100 ? '...' : ''}"`
      : 'Conversation vide';

    // Statistiques de la conversation
    const userMessages = conversationData.messages.filter(m => m.type === 'user').length;
    const botMessages = conversationData.messages.filter(m => m.type === 'bot').length;
    const startTime = new Date(conversationData.metadata.startTime).toLocaleString('fr-FR');
    const lastActivity = new Date(conversationData.metadata.lastActivity).toLocaleString('fr-FR');

    const conversationStats = `📊 Statistiques:
- Messages du client: ${userMessages}
- Réponses de l'assistant: ${botMessages}
- Début: ${startTime}
- Dernière activité: ${lastActivity}`;

    // Champs de base toujours présents
    const fields: any = {
      SessionID: sessionId,
      Messages: JSON.stringify(conversationData.messages, null, 2), // JSON formaté avec indentation
      Metadata: JSON.stringify(conversationData.metadata),
      LastActivity: new Date().toISOString(),
      MessageCount: conversationData.messages.length,
    };

    // Ajouter les champs formatés seulement s'ils sont supportés
    // Pour l'instant, on les commente jusqu'à ce qu'ils soient créés dans Airtable
    // fields.FormattedConversation = formattedConversation;
    // fields.ConversationSummary = conversationSummary;
    // fields.ConversationStats = conversationStats;

    // Alternative: stocker les informations formatées dans le champ Metadata
    const enrichedMetadata = {
      ...conversationData.metadata,
      formattedSummary: conversationSummary,
      stats: {
        userMessages,
        botMessages,
        startTimeFormatted: startTime,
        lastActivityFormatted: lastActivity
      }
    };
    fields.Metadata = JSON.stringify(enrichedMetadata, null, 2);
    
    // Stocker aussi une version texte simple dans UserMessage et BotResponse
    // On utilise les champs existants pour stocker un résumé formaté
    if (conversationData.messages.length > 0) {
      // Prendre le dernier échange
      const lastExchange = conversationData.messages.slice(-2);
      const lastUserMsg = lastExchange.find(m => m.type === 'user');
      const lastBotMsg = lastExchange.find(m => m.type === 'bot');
      
      if (lastUserMsg) {
        fields.UserMessage = `[${new Date(lastUserMsg.timestamp).toLocaleString('fr-FR')}]\n${lastUserMsg.content}`;
      }
      if (lastBotMsg) {
        fields.BotResponse = `[${new Date(lastBotMsg.timestamp).toLocaleString('fr-FR')}]\n${lastBotMsg.content}`;
      }
    }

    console.log('Saving conversation:', {
      sessionId,
      recordId,
      messageCount: conversationData.messages.length,
      hasRecordId: !!recordId
    });

    if (recordId) {
      // Mettre à jour l'enregistrement existant
      await base('Conversations').update(recordId, fields);
      console.log('Updated existing conversation record:', recordId);
    } else {
      // Créer un nouvel enregistrement
      const result = await base('Conversations').create([{ fields }]);
      console.log('Created new conversation record:', result[0].id);
    }
  } catch (error) {
    console.error('Error saving conversation:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    // Ne pas propager l'erreur pour ne pas bloquer la réponse
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ChatRequest;
    const { message, consentGiven } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Gérer la session avec cookies
    const session = await getOrCreateSession(request, null);
    console.log('Session info:', {
      sessionId: session.sessionId,
      consentGiven: session.consentGiven,
      consentFromRequest: consentGiven
    });
    
    // Si pas de consentement, demander le consentement
    if (!session.consentGiven && !consentGiven) {
      return NextResponse.json({
        response: "Pour utiliser ce chatbot, j'ai besoin de ton consentement pour stocker notre conversation dans un cookie. Cela me permettra de me souvenir de notre échange si tu reviens plus tard. Acceptes-tu ?",
        sessionId: session.sessionId,
        requiresConsent: true,
      });
    }

    // Si consentement donné, mettre à jour la session
    if (consentGiven && !session.consentGiven) {
      session.consentGiven = true;
      // La session sera sauvegardée dans le cookie avec la réponse
    }

    // Récupérer la conversation existante
    const { recordId, data: conversationData } = await getOrCreateConversation(session.sessionId);

    // Get FAQ data
    const faqData = await getFAQData();

    // Build prompt with context
    const prompt = buildPrompt(faqData, message, conversationData.messages);

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

    // Ajouter les messages à la conversation
    const userMessage: Message = {
      id: uuidv4(),
      type: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };

    const botMessage: Message = {
      id: uuidv4(),
      type: 'bot',
      content: response,
      timestamp: new Date().toISOString(),
    };

    conversationData.messages.push(userMessage, botMessage);
    conversationData.metadata.lastActivity = new Date().toISOString();
    conversationData.metadata.messageCount = conversationData.messages.length;

    // Sauvegarder la conversation mise à jour
    await saveConversation(session.sessionId, recordId, conversationData);

    // Créer la réponse avec les headers de cookie
    const result: ChatResponse = {
      response,
      sessionId: session.sessionId,
    };

    const nextResponse = NextResponse.json(result);
    
    // Sauvegarder la session dans le cookie
    nextResponse.cookies.set('kap_numerique_session', JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 jours
      path: '/',
    });

    return nextResponse;
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