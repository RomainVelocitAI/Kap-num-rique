import { NextRequest, NextResponse } from 'next/server';
import Airtable from 'airtable';

// Initialize Airtable
const base = new Airtable({
  apiKey: process.env.AIRTABLE_PAT,
}).base(process.env.AIRTABLE_BASE_ID || '');

interface ConversationRating {
  sessionId: string;
  rating: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ConversationRating;
    const { sessionId, rating } = body;

    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be a number between 1 and 5' },
        { status: 400 }
      );
    }

    // Find the conversation for this session and update its rating
    const records = await base('Conversations')
      .select({
        filterByFormula: `{SessionID} = '${sessionId}'`,
        maxRecords: 1,
      })
      .firstPage();

    if (records.length === 0) {
      return NextResponse.json(
        { error: 'No conversation found for this session' },
        { status: 404 }
      );
    }

    // Update the satisfaction rating
    await base('Conversations').update(records[0].id, {
      Satisfaction: rating,
    });

    return NextResponse.json({
      success: true,
      message: 'Rating saved successfully',
    });
  } catch (error) {
    console.error('Conversation rating API error:', error);
    return NextResponse.json(
      { error: 'Failed to save rating' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve conversation history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const records = await base('Conversations')
      .select({
        filterByFormula: `{SessionID} = '${sessionId}'`,
        maxRecords: 1,
        fields: ['SessionID', 'Messages', 'Metadata', 'Satisfaction'],
      })
      .firstPage();

    if (records.length === 0) {
      return NextResponse.json({
        sessionId,
        messages: [],
        metadata: null,
      });
    }

    const record = records[0];
    const messagesField = record.get('Messages');
    const metadataField = record.get('Metadata');

    return NextResponse.json({
      sessionId,
      messages: messagesField ? JSON.parse(messagesField as string) : [],
      metadata: metadataField ? JSON.parse(metadataField as string) : null,
      satisfaction: record.get('Satisfaction'),
    });
  } catch (error) {
    console.error('Conversation history API error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve conversation history' },
      { status: 500 }
    );
  }
}