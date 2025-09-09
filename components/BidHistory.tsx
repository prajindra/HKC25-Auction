
'use client';

import { AuctionItem } from '@/lib/mockData';

interface BidHistoryProps {
  items: AuctionItem[];
}

export default function BidHistory({ items }: BidHistoryProps) {
  const allBids = items.flatMap(item => 
    item.bids.map(bid => ({
      ...bid,
      timestamp: typeof bid.timestamp === 'string' ? new Date(bid.timestamp) : bid.timestamp,
      itemTitle: item.title,
      itemId: item.id
    }))
  ).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Bid History</h2>
        <div className="text-sm text-gray-600">
          Total Bids: <span className="font-semibold">{allBids.length}</span>
        </div>
      </div>

      {allBids.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full mx-auto mb-4">
            <i className="ri-auction-line text-2xl text-gray-400"></i>
          </div>
          <p className="text-xl text-gray-500">No bids placed yet</p>
          <p className="text-gray-400 mt-2">Bids will appear here as users participate in auctions</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Item</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Bidder</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Bid Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {allBids.map((bid, index) => (
                  <tr key={bid.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800">{bid.itemTitle}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800">{bid.bidderName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        <div>{bid.bidderEmail}</div>
                        <div>{bid.bidderPhone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-lg font-bold text-orange-600">
                        RM{bid.amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        <div>{bid.timestamp.toLocaleDateString()}</div>
                        <div>{bid.timestamp.toLocaleTimeString()}</div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
