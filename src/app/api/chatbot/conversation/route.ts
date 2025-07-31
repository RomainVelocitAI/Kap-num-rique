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

    // Find the last conversation for this session and update its rating
    const records = await base('Conversations')
      .select({
        filterByFormula: `{SessionID} = '${sessionId}'`,
        maxRecords: 1,
        sort: [{ field: 'Timestamp', direction: 'desc' }],
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
        sort: [{ field: 'Timestamp', direction: 'asc' }],
        fields: ['MessageID', 'UserMessage', 'BotResponse', 'Timestamp', 'Satisfaction'],
      })
      .all();

    const conversations = records.map((record) => ({
      messageId: record.get('MessageID'),
      userMessage: record.get('UserMessage'),
      botResponse: record.get('BotResponse'),
      timestamp: record.get('Timestamp'),
      satisfaction: record.get('Satisfaction'),
    }));

    return NextResponse.json({
      sessionId,
      conversations,
    });
  } catch (error) {
    console.error('Conversation history API error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve conversation history' },
      { status: 500 }
    );
  }
}