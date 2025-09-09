
'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuctionCard from '@/components/AuctionCard';
import BiddingModal from '@/components/BiddingModal';
import { mockAuctionItems, AuctionItem } from '@/lib/mockData';

export default function Home() {
  const [auctionItems, setAuctionItems] = useState<AuctionItem[]>(() => {
    // Initialize with mock data first to prevent hydration mismatch
    return mockAuctionItems.map(item => ({
      ...item,
      bids: [],
      totalBids: 0,
      currentBid: item.startingBid
    }));
  });
  const [selectedItem, setSelectedItem] = useState<AuctionItem | null>(null);
  const [showBiddingModal, setShowBiddingModal] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Load data from localStorage after component mounts
  useEffect(() => {
    setIsClient(true);
    const storedData = localStorage.getItem('auctionItems');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        // Convert timestamp strings back to Date objects
        const processedData = parsedData.map((item: any) => ({
          ...item,
          bids: item.bids.map((bid: any) => ({
            ...bid,
            timestamp: new Date(bid.timestamp)
          }))
        }));
        setAuctionItems(processedData);
      } catch (error) {
        console.error('Error parsing stored auction data:', error);
      }
    }
  }, []);

  // Save to localStorage whenever auctionItems changes (but only after client mount)
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('auctionItems', JSON.stringify(auctionItems));
      window.dispatchEvent(new Event('storage'));
    }
  }, [auctionItems, isClient]);

  const handleBidClick = (item: AuctionItem) => {
    setSelectedItem(item);
    setShowBiddingModal(true);
  };

  const handleBidSubmit = (itemId: string, bidAmount: number, bidderInfo: any) => {
    setAuctionItems(prev => {
      const updatedItems = prev.map(item => {
        if (item.id === itemId) {
          const newBid = {
            id: Date.now().toString(),
            amount: bidAmount,
            bidderName: bidderInfo.name,
            bidderEmail: bidderInfo.email,
            bidderPhone: bidderInfo.phone,
            timestamp: new Date()
          };
          
          return {
            ...item,
            currentBid: bidAmount,
            totalBids: item.totalBids + 1,
            bids: [newBid, ...item.bids]
          };
        }
        return item;
      });
      
      return updatedItems;
    });
    
    setShowBiddingModal(false);
    setSelectedItem(null);
  };

  const activeItems = auctionItems.filter(item => item.isActive);
  const upcomingItems = auctionItems.filter(item => !item.isActive);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Limited-Edition Spiritual Paraphernalia Auction
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Participate in our spiritual auction to support Hare Krishna Convention 2025. 
            Every bid helps spread Krishna consciousness and supports our new preaching initiatives.
          </p>
        </div>

        {activeItems.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center mb-8">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-3"></div>
              <h2 className="text-3xl font-bold text-gray-800">Live Auctions</h2>
              <span className="ml-4 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                {activeItems.length} Active
              </span>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeItems.map(item => (
                <AuctionCard 
                  key={item.id} 
                  item={item} 
                  onBidClick={handleBidClick}
                />
              ))}
            </div>
          </section>
        )}

        {upcomingItems.length > 0 && (
          <section>
            <div className="flex items-center mb-8">
              <div className="w-3 h-3 bg-gray-400 rounded-full mr-3"></div>
              <h2 className="text-3xl font-bold text-gray-800">Upcoming Items</h2>
              <span className="ml-4 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-semibold">
                {upcomingItems.length} Items
              </span>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingItems.map(item => (
                <AuctionCard 
                  key={item.id} 
                  item={item} 
                  onBidClick={handleBidClick}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      {showBiddingModal && selectedItem && (
        <BiddingModal 
          item={selectedItem}
          onClose={() => setShowBiddingModal(false)}
          onBidSubmit={handleBidSubmit}
        />
      )}

      <Footer />
    </div>
  );
}
