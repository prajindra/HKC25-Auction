// Database configuration and connection
import { AuctionItem, Bid } from './mockData';

// For development, we'll use a simple JSON file-based approach
// In production, you'd want to use a proper database like PostgreSQL, MongoDB, etc.

const DB_FILE_PATH = './data/auction-data.json';

export interface DatabaseData {
  auctionItems: AuctionItem[];
  lastUpdated: string;
}

// Initialize default data structure
const defaultData: DatabaseData = {
  auctionItems: [],
  lastUpdated: new Date().toISOString()
};

// Database operations
export class AuctionDatabase {
  private static instance: AuctionDatabase;
  private data: DatabaseData = defaultData;

  private constructor() {
    this.loadData();
  }

  public static getInstance(): AuctionDatabase {
    if (!AuctionDatabase.instance) {
      AuctionDatabase.instance = new AuctionDatabase();
    }
    return AuctionDatabase.instance;
  }

  private async loadData(): Promise<void> {
    try {
      // In a real implementation, this would load from a database
      // For now, we'll simulate with in-memory storage
      const stored = global.auctionData as DatabaseData;
      if (stored) {
        this.data = stored;
      } else {
        // Initialize with mock data if no data exists
        const { mockAuctionItems } = await import('./mockData');
        this.data = {
          auctionItems: mockAuctionItems.map(item => ({
            ...item,
            bids: [],
            totalBids: 0,
            currentBid: item.startingBid
          })),
          lastUpdated: new Date().toISOString()
        };
        this.saveData();
      }
    } catch (error) {
      console.error('Error loading data:', error);
      this.data = defaultData;
    }
  }

  private async saveData(): Promise<void> {
    try {
      this.data.lastUpdated = new Date().toISOString();
      // Store in global for simulation (in production, save to database)
      global.auctionData = this.data;
    } catch (error) {
      console.error('Error saving data:', error);
      throw new Error('Failed to save data');
    }
  }

  // Get all auction items
  public async getAllItems(): Promise<AuctionItem[]> {
    return [...this.data.auctionItems];
  }

  // Get a specific item by ID
  public async getItemById(id: string): Promise<AuctionItem | null> {
    const item = this.data.auctionItems.find(item => item.id === id);
    return item ? { ...item } : null;
  }

  // Update an auction item
  public async updateItem(id: string, updates: Partial<AuctionItem>): Promise<AuctionItem | null> {
    const itemIndex = this.data.auctionItems.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      return null;
    }

    this.data.auctionItems[itemIndex] = {
      ...this.data.auctionItems[itemIndex],
      ...updates
    };

    await this.saveData();
    return { ...this.data.auctionItems[itemIndex] };
  }

  // Add a new auction item
  public async addItem(item: Omit<AuctionItem, 'id'>): Promise<AuctionItem> {
    const newItem: AuctionItem = {
      ...item,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };

    this.data.auctionItems.push(newItem);
    await this.saveData();
    return { ...newItem };
  }

  // Delete an auction item
  public async deleteItem(id: string): Promise<boolean> {
    const initialLength = this.data.auctionItems.length;
    this.data.auctionItems = this.data.auctionItems.filter(item => item.id !== id);
    
    if (this.data.auctionItems.length < initialLength) {
      await this.saveData();
      return true;
    }
    return false;
  }

  // Add a bid to an item
  public async addBid(itemId: string, bid: Omit<Bid, 'id'>): Promise<AuctionItem | null> {
    const itemIndex = this.data.auctionItems.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      return null;
    }

    const newBid: Bid = {
      ...bid,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(bid.timestamp)
    };

    const item = this.data.auctionItems[itemIndex];
    item.bids = [newBid, ...item.bids];
    item.totalBids = item.bids.length;
    item.currentBid = bid.amount;

    await this.saveData();
    return { ...item };
  }

  // Toggle item active status
  public async toggleItemStatus(id: string): Promise<AuctionItem | null> {
    const itemIndex = this.data.auctionItems.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      return null;
    }

    this.data.auctionItems[itemIndex].isActive = !this.data.auctionItems[itemIndex].isActive;
    await this.saveData();
    return { ...this.data.auctionItems[itemIndex] };
  }

  // Get database info
  public async getInfo(): Promise<{ totalItems: number; lastUpdated: string }> {
    return {
      totalItems: this.data.auctionItems.length,
      lastUpdated: this.data.lastUpdated
    };
  }
}

// Global type declaration for Node.js global object
declare global {
  var auctionData: DatabaseData | undefined;
}
