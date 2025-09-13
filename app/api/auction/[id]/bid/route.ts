import { NextRequest, NextResponse } from 'next/server';
import { AuctionDatabase } from '@/lib/database';

// POST - Place a bid on an auction item
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const db = AuctionDatabase.getInstance();
    
    // Validate required fields
    const { amount, bidderName, bidderEmail, bidderPhone } = body;
    if (!amount || !bidderName || !bidderEmail || !bidderPhone) {
      return NextResponse.json(
        { success: false, error: 'Missing required bid information' },
        { status: 400 }
      );
    }

    // Get the current item to validate the bid
    const currentItem = await db.getItemById(params.id);
    if (!currentItem) {
      return NextResponse.json(
        { success: false, error: 'Auction item not found' },
        { status: 404 }
      );
    }

    // Check if the auction is active
    if (!currentItem.isActive) {
      return NextResponse.json(
        { success: false, error: 'This auction is not currently active' },
        { status: 400 }
      );
    }

    // Validate bid amount
    const bidAmount = Number(amount);
    const minimumBid = currentItem.currentBid + currentItem.bidIncrement;
    
    if (bidAmount < minimumBid) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Bid must be at least RM${minimumBid} (current bid + increment)`,
          minimumBid 
        },
        { status: 400 }
      );
    }

    // Check if auction has ended
    if (currentItem.endTime && new Date() > new Date(currentItem.endTime)) {
      return NextResponse.json(
        { success: false, error: 'This auction has ended' },
        { status: 400 }
      );
    }

    // Place the bid
    const updatedItem = await db.addBid(params.id, {
      amount: bidAmount,
      bidderName,
      bidderEmail,
      bidderPhone,
      timestamp: new Date()
    });

    if (!updatedItem) {
      return NextResponse.json(
        { success: false, error: 'Failed to place bid' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedItem,
      message: 'Bid placed successfully'
    });
  } catch (error) {
    console.error('Error placing bid:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to place bid' },
      { status: 500 }
    );
  }
}
