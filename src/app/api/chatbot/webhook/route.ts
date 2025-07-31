import { NextRequest, NextResponse } from 'next/server';

// This webhook can be called by Airtable when FAQ data changes
export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature if needed
    const signature = request.headers.get('x-airtable-signature');
    
    // Optional: Verify the webhook is from Airtable
    // const expectedSignature = process.env.AIRTABLE_WEBHOOK_SECRET;
    // if (expectedSignature && signature !== expectedSignature) {
    //   return NextResponse.json(
    //     { error: 'Invalid signature' },
    //     { status: 401 }
    //   );
    // }

    const body = await request.json();
    console.log('Airtable webhook received:', {
      timestamp: new Date().toISOString(),
      event: body.type || 'unknown',
      baseId: body.baseId,
      tableId: body.tableId,
    });

    // Clear the cache by calling the refresh endpoint
    // In a production environment with multiple instances,
    // you'd want to use a distributed cache or message queue
    
    // For now, we'll just log that cache should be refreshed
    // The next request will fetch fresh data
    
    return NextResponse.json({
      success: true,
      message: 'Webhook processed - cache will refresh on next request',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// GET endpoint for webhook verification
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Airtable webhook endpoint is active',
    usage: 'POST to this endpoint when FAQ data changes in Airtable',
  });
}