import { NextRequest, NextResponse } from 'next/server';
import { AuctionDatabase } from '@/lib/database';

// POST - Toggle auction item active status
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = AuctionDatabase.getInstance();
    const updatedItem = await db.toggleItemStatus(params.id);
    
    if (!updatedItem) {
      return NextResponse.json(
        { success: false, error: 'Auction item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedItem,
      message: `Auction ${updatedItem.isActive ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error('Error toggling auction status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to toggle auction status' },
      { status: 500 }
    );
  }
}
