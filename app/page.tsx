
'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuctionCard from '@/components/AuctionCard';
import BiddingModal from '@/components/BiddingModal';
import { AuctionItem } from '@/lib/mockData';
import { fetchAuctionItems, placeBid, BidData } from '@/lib/api';

export default function Home() {
  const [auctionItems, setAuctionItems] = useState<AuctionItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<AuctionItem | null>(null);
  const [showBiddingModal, setShowBiddingModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from API
  const loadAuctionItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const items = await fetchAuctionItems();
      setAuctionItems(items);
    } catch (error) {
      console.error('Error loading auction items:', error);
      setError('Failed to load auction items. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadAuctionItems();
  }, []);

  // Auto-refresh data every 30 seconds to keep it synchronized
  useEffect(() => {
    const interval = setInterval(() => {
      loadAuctionItems();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleBidClick = (item: AuctionItem) => {
    setSelectedItem(item);
    setShowBiddingModal(true);
  };

  const handleBidSubmit = async (itemId: string, bidAmount: number, bidderInfo: any) => {
    try {
      const bidData: BidData = {
        amount: bidAmount,
        bidderName: bidderInfo.name,
        bidderEmail: bidderInfo.email,
        bidderPhone: bidderInfo.phone,
      };

      const updatedItem = await placeBid(itemId, bidData);
      
      // Update the local state with the new item data
      setAuctionItems(prev => 
        prev.map(item => item.id === itemId ? updatedItem : item)
      );
      
      setShowBiddingModal(false);
      setSelectedItem(null);
      
      // Show success message
      alert('Bid placed successfully!');
    } catch (error) {
      console.error('Error placing bid:', error);
      alert(error instanceof Error ? error.message : 'Failed to place bid. Please try again.');
    }
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

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-gray-600">Loading auction items...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl max-w-md mx-auto">
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
              <button 
                onClick={loadAuctionItems}
                className="mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
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

            {!loading && auctionItems.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500">
                  <p className="text-xl font-semibold mb-2">No auction items available</p>
                  <p>Please check back later for new items.</p>
                </div>
              </div>
            )}
          </>
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
