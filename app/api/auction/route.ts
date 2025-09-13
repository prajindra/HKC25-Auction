import { NextRequest, NextResponse } from 'next/server';
import { AuctionDatabase } from '@/lib/database';

// GET - Fetch all auction items
export async function GET() {
  try {
    const db = AuctionDatabase.getInstance();
    const items = await db.getAllItems();
    
    return NextResponse.json({
      success: true,
      data: items,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching auction items:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch auction items' },
      { status: 500 }
    );
  }
}

// POST - Add a new auction item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = AuctionDatabase.getInstance();
    
    // Validate required fields
    const { title, description, image, startingBid, bidIncrement } = body;
    if (!title || !description || !image || !startingBid || !bidIncrement) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newItem = await db.addItem({
      title,
      description,
      image,
      startingBid: Number(startingBid),
      currentBid: Number(startingBid),
      bidIncrement: Number(bidIncrement),
      totalBids: 0,
      isActive: false,
      endTime: body.endTime ? new Date(body.endTime) : undefined,
      bids: []
    });

    return NextResponse.json({
      success: true,
      data: newItem,
      message: 'Auction item created successfully'
    });
  } catch (error) {
    console.error('Error creating auction item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create auction item' },
      { status: 500 }
    );
  }
}
