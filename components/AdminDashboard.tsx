
'use client';

import { useState, useEffect } from 'react';
import { mockAuctionItems, AuctionItem } from '@/lib/mockData';
import ItemManagement from '@/components/ItemManagement';
import BidHistory from '@/components/BidHistory';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'items' | 'bids'>('items');
  const [auctionItems, setAuctionItems] = useState<AuctionItem[]>(() => {
    // Check localStorage first
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem('auctionItems');
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          // Convert timestamp strings back to Date objects
          return parsedData.map((item: any) => ({
            ...item,
            bids: item.bids.map((bid: any) => ({
              ...bid,
              timestamp: new Date(bid.timestamp)
            }))
          }));
        } catch (error) {
          console.error('Error parsing stored auction data:', error);
        }
      }
    }
    
    // Initialize with cleared mock data
    return mockAuctionItems.map(item => ({
      ...item,
      bids: [],
      totalBids: 0,
      currentBid: item.startingBid
    }));
  });

  // Listen for data changes from main page
  useEffect(() => {
    const handleStorageChange = () => {
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
    };

    // Listen for storage changes from other tabs/windows
    window.addEventListener('storage', handleStorageChange);
    
    // Listen for custom events from same tab
    window.addEventListener('storage', handleStorageChange);
    
    // Check for existing data on mount
    handleStorageChange();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Save changes back to localStorage
  const updateAuctionItems = (updatedItems: AuctionItem[]) => {
    setAuctionItems(updatedItems);
    localStorage.setItem('auctionItems', JSON.stringify(updatedItems));
    window.dispatchEvent(new Event('storage'));
  };

  const toggleItemStatus = (itemId: string) => {
    const updatedItems = auctionItems.map(item => 
      item.id === itemId ? { ...item, isActive: !item.isActive } : item
    );
    updateAuctionItems(updatedItems);
  };

  const deleteItem = (itemId: string) => {
    const updatedItems = auctionItems.filter(item => item.id !== itemId);
    updateAuctionItems(updatedItems);
  };

  const updateItem = (itemId: string, updatedData: Partial<AuctionItem>) => {
    const updatedItems = auctionItems.map(item => 
      item.id === itemId ? { ...item, ...updatedData } : item
    );
    updateAuctionItems(updatedItems);
  };

  const exportBidsData = () => {
    const allBids = auctionItems.flatMap(item => 
      item.bids.map(bid => ({
        itemTitle: item.title,
        bidderName: bid.bidderName,
        bidderEmail: bid.bidderEmail,
        bidderPhone: bid.bidderPhone,
        bidAmount: bid.amount,
        timestamp: bid.timestamp.toLocaleString()
      }))
    );

    if (allBids.length === 0) {
      alert('No bids available to export. Please wait for users to place bids first.');
      return;
    }

    const csvContent = [
      ['Item Name', 'Bidder Name', 'Email', 'Phone', 'Bid Amount', 'Timestamp'],
      ...allBids.map(bid => [
        `"${bid.itemTitle}"`,
        `"${bid.bidderName}"`,
        `"${bid.bidderEmail}"`,
        `"${bid.bidderPhone}"`,
        `"RM${bid.bidAmount}"`,
        `"${bid.timestamp}"`
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hkc25-auction-bids-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const totalActiveItems = auctionItems.filter(item => item.isActive).length;
  const totalBids = auctionItems.reduce((sum, item) => sum + item.totalBids, 0);
  const totalRevenue = auctionItems.reduce((sum, item) => sum + item.currentBid, 0);

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage HKC 25 auction items and monitor bidding activity</p>
          </div>
          
          <button
            onClick={exportBidsData}
            className="bg-green-500 hover:bg-green-6 0 text-white px-6 py-3 rounded-xl font-semibold transition-colors whitespace-nowrap cursor-pointer flex items-center space-x-2"
          >
            <i className="ri-download-line w-5 h-5 flex items-center justify-center"></i>
            <span>Export CSV</span>
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-semibold">Total Items</p>
                <p className="text-3xl font-bold text-blue-800">{auctionItems.length}</p>
              </div>
              <div className="w-12 h-12 flex items-center justify-center bg-blue-500 rounded-full">
                <i className="ri-auction-line text-white text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-semibold">Active Auctions</p>
                <p className="text-3xl font-bold text-green-800">{totalActiveItems}</p>
              </div>
              <div className="w-12 h-12 flex items-center justify-center bg-green-500 rounded-full">
                <i className="ri-play-circle-line text-white text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-semibold">Total Bids</p>
                <p className="text-3xl font-bold text-orange-800">{totalBids}</p>
              </div>
              <div className="w-12 h-12 flex items-center justify-center bg-orange-500 rounded-full">
                <i className="ri-hand-heart-line text-white text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-semibold">Total Value</p>
                <p className="text-3xl font-bold text-purple-800">RM{totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 flex items-center justify-center bg-purple-500 rounded-full">
                <i className="ri-money-dollar-circle-line text-white text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-2 mb-8">
          <button
            onClick={() => setActiveTab('items')}
            className={`px-6 py-3 rounded-full font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'items'
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Item Management
          </button>
          <button
            onClick={() => setActiveTab('bids')}
            className={`px-6 py-3 rounded-full font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'bids'
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Bid History
          </button>
        </div>

        {activeTab === 'items' ? (
          <ItemManagement 
            items={auctionItems}
            onToggleStatus={toggleItemStatus}
            onDeleteItem={deleteItem}
            onUpdateItem={updateItem}
          />
        ) : (
          <BidHistory items={auctionItems} />
        )}
      </div>
    </div>
  );
}
