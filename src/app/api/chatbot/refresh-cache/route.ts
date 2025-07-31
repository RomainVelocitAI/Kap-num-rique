import { NextRequest, NextResponse } from 'next/server';
import Airtable from 'airtable';

// Initialize Airtable
const base = new Airtable({
  apiKey: process.env.AIRTABLE_PAT,
}).base(process.env.AIRTABLE_BASE_ID || '');

// Simple in-memory cache that will be shared with the main chatbot route
// Note: This works in development but in production with multiple instances,
// you might want to use Redis or another distributed cache
export const runtime = 'nodejs';

// GET endpoint to check cache status
export async function GET() {
  return NextResponse.json({
    message: 'Use POST to refresh the FAQ cache',
    cacheInfo: 'Cache is managed by the main chatbot route'
  });
}

// POST endpoint to force cache refresh
export async function POST(request: NextRequest) {
  try {
    // Check for authorization if needed
    const authHeader = request.headers.get('authorization');
    
    // Optional: Add basic authentication for security
    // const expectedToken = process.env.CACHE_REFRESH_TOKEN;
    // if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }

    // Fetch fresh data from Airtable
    const records: any[] = [];
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

    // Send a response with the number of FAQs found
    return NextResponse.json({
      success: true,
      message: 'Cache refresh initiated',
      faqCount: records.length,
      timestamp: new Date().toISOString(),
      note: 'The main chatbot route will fetch fresh data on the next request'
    });
  } catch (error) {
    console.error('Cache refresh error:', error);
    return NextResponse.json(
      { error: 'Failed to refresh cache' },
      { status: 500 }
    );
  }
}