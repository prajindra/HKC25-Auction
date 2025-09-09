'use client';

import { useState, useEffect } from 'react';
import { AuctionItem } from '@/lib/mockData';

interface AuctionCardProps {
  item: AuctionItem;
  onBidClick: (item: AuctionItem) => void;
}

export default function AuctionCard({ item, onBidClick }: AuctionCardProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!item.endTime) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const endTime = new Date(item.endTime!).getTime();
      const difference = endTime - now;

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      } else {
        setTimeLeft('Ended');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [item.endTime]);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
      <div className="relative">
        <img 
          src={item.image} 
          alt={item.title}
          className="w-full h-64 object-cover object-top"
        />
        <div className="absolute top-4 right-4">
          {item.isActive ? (
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-2"></div>
              Live
            </span>
          ) : (
            <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Upcoming
            </span>
          )}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
          {item.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {item.description}
        </p>
        
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Current Bid</span>
            <span className="text-2xl font-bold text-orange-600">
              RM{item.currentBid.toLocaleString()}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Total Bids</span>
            <span className="text-lg font-semibold text-gray-700">
              {item.totalBids}
            </span>
          </div>
          
          {item.endTime && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Time Left</span>
              <span className={`text-lg font-semibold ${timeLeft === 'Ended' ? 'text-red-500' : 'text-green-600'}`}>
                {timeLeft}
              </span>
            </div>
          )}
        </div>
        
        <button
          onClick={() => onBidClick(item)}
          disabled={!item.isActive || timeLeft === 'Ended'}
          className={`w-full py-3 px-6 rounded-full font-semibold transition-all duration-200 whitespace-nowrap ${
            item.isActive && timeLeft !== 'Ended'
              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transform hover:scale-105 cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {item.isActive 
            ? timeLeft === 'Ended' 
              ? 'Auction Ended' 
              : 'Place Bid'
            : 'Coming Soon'
          }
        </button>
      </div>
    </div>
  );
}