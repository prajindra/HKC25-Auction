// API utility functions for auction operations
import { AuctionItem, Bid } from './mockData';

const API_BASE = '/api/auction';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

export interface BidData {
  amount: number;
  bidderName: string;
  bidderEmail: string;
  bidderPhone: string;
}

// Fetch all auction items
export async function fetchAuctionItems(): Promise<AuctionItem[]> {
  try {
    const response = await fetch(API_BASE, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result: ApiResponse<AuctionItem[]> = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch auction items');
    }

    // Convert date strings back to Date objects
    return result.data?.map(item => ({
      ...item,
      endTime: item.endTime ? new Date(item.endTime) : undefined,
      bids: item.bids.map(bid => ({
        ...bid,
        timestamp: new Date(bid.timestamp)
      }))
    })) || [];
  } catch (error) {
    console.error('Error fetching auction items:', error);
    throw error;
  }
}

// Fetch a specific auction item
export async function fetchAuctionItem(id: string): Promise<AuctionItem> {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result: ApiResponse<AuctionItem> = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch auction item');
    }

    if (!result.data) {
      throw new Error('No data received');
    }

    // Convert date strings back to Date objects
    return {
      ...result.data,
      endTime: result.data.endTime ? new Date(result.data.endTime) : undefined,
      bids: result.data.bids.map(bid => ({
        ...bid,
        timestamp: new Date(bid.timestamp)
      }))
    };
  } catch (error) {
    console.error('Error fetching auction item:', error);
    throw error;
  }
}

// Update an auction item
export async function updateAuctionItem(id: string, updates: Partial<AuctionItem>): Promise<AuctionItem> {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    const result: ApiResponse<AuctionItem> = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to update auction item');
    }

    if (!result.data) {
      throw new Error('No data received');
    }

    // Convert date strings back to Date objects
    return {
      ...result.data,
      endTime: result.data.endTime ? new Date(result.data.endTime) : undefined,
      bids: result.data.bids.map(bid => ({
        ...bid,
        timestamp: new Date(bid.timestamp)
      }))
    };
  } catch (error) {
    console.error('Error updating auction item:', error);
    throw error;
  }
}

// Delete an auction item
export async function deleteAuctionItem(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result: ApiResponse = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to delete auction item');
    }
  } catch (error) {
    console.error('Error deleting auction item:', error);
    throw error;
  }
}

// Toggle auction item status
export async function toggleAuctionStatus(id: string): Promise<AuctionItem> {
  try {
    const response = await fetch(`${API_BASE}/${id}/toggle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result: ApiResponse<AuctionItem> = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to toggle auction status');
    }

    if (!result.data) {
      throw new Error('No data received');
    }

    // Convert date strings back to Date objects
    return {
      ...result.data,
      endTime: result.data.endTime ? new Date(result.data.endTime) : undefined,
      bids: result.data.bids.map(bid => ({
        ...bid,
        timestamp: new Date(bid.timestamp)
      }))
    };
  } catch (error) {
    console.error('Error toggling auction status:', error);
    throw error;
  }
}

// Place a bid on an auction item
export async function placeBid(id: string, bidData: BidData): Promise<AuctionItem> {
  try {
    const response = await fetch(`${API_BASE}/${id}/bid`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bidData),
    });

    const result: ApiResponse<AuctionItem> = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to place bid');
    }

    if (!result.data) {
      throw new Error('No data received');
    }

    // Convert date strings back to Date objects
    return {
      ...result.data,
      endTime: result.data.endTime ? new Date(result.data.endTime) : undefined,
      bids: result.data.bids.map(bid => ({
        ...bid,
        timestamp: new Date(bid.timestamp)
      }))
    };
  } catch (error) {
    console.error('Error placing bid:', error);
    throw error;
  }
}

// Add a new auction item
export async function addAuctionItem(itemData: Omit<AuctionItem, 'id' | 'bids' | 'totalBids' | 'currentBid'>): Promise<AuctionItem> {
  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itemData),
    });

    const result: ApiResponse<AuctionItem> = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to add auction item');
    }

    if (!result.data) {
      throw new Error('No data received');
    }

    // Convert date strings back to Date objects
    return {
      ...result.data,
      endTime: result.data.endTime ? new Date(result.data.endTime) : undefined,
      bids: result.data.bids.map(bid => ({
        ...bid,
        timestamp: new Date(bid.timestamp)
      }))
    };
  } catch (error) {
    console.error('Error adding auction item:', error);
    throw error;
  }
}
