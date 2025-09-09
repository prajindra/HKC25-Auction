'use client';

import { useState } from 'react';
import { AuctionItem } from '@/lib/mockData';

interface BiddingModalProps {
  item: AuctionItem;
  onClose: () => void;
  onBidSubmit: (itemId: string, bidAmount: number, bidderInfo: any) => void;
}

export default function BiddingModal({ item, onClose, onBidSubmit }: BiddingModalProps) {
  const [bidAmount, setBidAmount] = useState(item.currentBid + item.bidIncrement);
  const [bidderName, setBidderName] = useState('');
  const [bidderEmail, setBidderEmail] = useState('');
  const [bidderPhone, setBidderPhone] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (bidAmount <= item.currentBid) {
      setNotificationMessage('Bid must be higher than current bid!');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      return;
    }

    if (!bidderName || !bidderEmail || !bidderPhone) {
      setNotificationMessage('Please fill all required fields!');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      return;
    }

    onBidSubmit(item.id, bidAmount, {
      name: bidderName,
      email: bidderEmail,
      phone: bidderPhone
    });
  };

  const incrementBid = () => {
    setBidAmount(prev => prev + item.bidIncrement);
  };

  const decrementBid = () => {
    setBidAmount(prev => Math.max(prev - item.bidIncrement, item.currentBid + item.bidIncrement));
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <img 
            src={item.image} 
            alt={item.title}
            className="w-full h-64 object-cover object-top rounded-t-3xl"
          />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 hover:bg-white w-10 h-10 flex items-center justify-center rounded-full transition-colors cursor-pointer"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>
        
        <div className="p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{item.title}</h2>
          <p className="text-gray-600 mb-6">{item.description}</p>
          
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Current Bid</p>
                <p className="text-3xl font-bold text-orange-600">RM{item.currentBid.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Total Bids</p>
                <p className="text-2xl font-bold text-gray-700">{item.totalBids}</p>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">Minimum Next Bid</p>
              <p className="text-xl font-bold text-green-600">
                RM{(item.currentBid + item.bidIncrement).toLocaleString()}
              </p>
            </div>
          </div>

          {showNotification && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              {notificationMessage}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Bid Amount
              </label>
              <div className="flex items-center space-x-4">
                <button 
                  type="button"
                  onClick={decrementBid}
                  className="w-12 h-12 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
                >
                  <i className="ri-subtract-line text-xl"></i>
                </button>
                
                <div className="flex-1 relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl font-bold text-gray-600">
                    RM
                  </div>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    min={item.currentBid + item.bidIncrement}
                    step={item.bidIncrement}
                    className="w-full pl-14 pr-4 py-4 text-2xl font-bold text-center border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none text-sm"
                    required
                  />
                </div>
                
                <button 
                  type="button"
                  onClick={incrementBid}
                  className="w-12 h-12 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
                >
                  <i className="ri-add-line text-xl"></i>
                </button>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={bidderName}
                  onChange={(e) => setBidderName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-sm"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={bidderEmail}
                  onChange={(e) => setBidderEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-sm"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={bidderPhone}
                onChange={(e) => setBidderPhone(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-sm"
                placeholder="+1 (555) 123-4567"
                required
              />
            </div>
            
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 px-6 border-2 border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-4 px-6 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 whitespace-nowrap cursor-pointer"
              >
                Place Bid
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}