import { NextRequest, NextResponse } from 'next/server';
import { AuctionDatabase } from '@/lib/database';

// GET - Fetch a specific auction item
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = AuctionDatabase.getInstance();
    const item = await db.getItemById(params.id);
    
    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Auction item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Error fetching auction item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch auction item' },
      { status: 500 }
    );
  }
}

// PUT - Update an auction item
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const db = AuctionDatabase.getInstance();
    
    // Process the update data
    const updateData: any = { ...body };
    
    // Convert endTime to Date if provided
    if (updateData.endTime) {
      updateData.endTime = new Date(updateData.endTime);
    }
    
    // Convert numeric fields
    if (updateData.startingBid !== undefined) {
      updateData.startingBid = Number(updateData.startingBid);
    }
    if (updateData.bidIncrement !== undefined) {
      updateData.bidIncrement = Number(updateData.bidIncrement);
    }
    if (updateData.currentBid !== undefined) {
      updateData.currentBid = Number(updateData.currentBid);
    }

    const updatedItem = await db.updateItem(params.id, updateData);
    
    if (!updatedItem) {
      return NextResponse.json(
        { success: false, error: 'Auction item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedItem,
      message: 'Auction item updated successfully'
    });
  } catch (error) {
    console.error('Error updating auction item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update auction item' },
      { status: 500 }
    );
  }
}

// DELETE - Delete an auction item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = AuctionDatabase.getInstance();
    const deleted = await db.deleteItem(params.id);
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Auction item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Auction item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting auction item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete auction item' },
      { status: 500 }
    );
  }
}
