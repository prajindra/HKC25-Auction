
'use client';

import { useState } from 'react';
import { AuctionItem } from '@/lib/mockData';

interface ItemManagementProps {
  items: AuctionItem[];
  onToggleStatus: (itemId: string) => void;
  onDeleteItem: (itemId: string) => void;
  onUpdateItem: (itemId: string, updatedData: Partial<AuctionItem>) => void;
}

export default function ItemManagement({ items, onToggleStatus, onDeleteItem, onUpdateItem }: ItemManagementProps) {
  const [editingItem, setEditingItem] = useState<AuctionItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    image: '',
    startingBid: 0,
    bidIncrement: 0,
    endDate: '',
    endTime: ''
  });
  const [addForm, setAddForm] = useState({
    title: '',
    description: '',
    image: '',
    startingBid: 0,
    bidIncrement: 0,
    endDate: '',
    endTime: ''
  });

  const handleEditClick = (item: AuctionItem) => {
    setEditingItem(item);
    
    // Format existing end time for form inputs
    let endDate = '';
    let endTime = '';
    
    if (item.endTime) {
      const date = new Date(item.endTime);
      endDate = date.toISOString().split('T')[0];
      endTime = date.toTimeString().slice(0, 5);
    }
    
    setEditForm({
      title: item.title,
      description: item.description,
      image: item.image,
      startingBid: item.startingBid,
      bidIncrement: item.bidIncrement,
      endDate,
      endTime
    });
  };

  const handleSaveEdit = () => {
    if (editingItem) {
      // Combine date and time into a Date object
      let endDateTime = undefined;
      if (editForm.endDate && editForm.endTime) {
        endDateTime = new Date(`${editForm.endDate}T${editForm.endTime}`);
      }
      
      onUpdateItem(editingItem.id, {
        title: editForm.title,
        description: editForm.description,
        image: editForm.image,
        startingBid: editForm.startingBid,
        bidIncrement: editForm.bidIncrement,
        endTime: endDateTime
      });
    }
    setEditingItem(null);
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 3000);
  };

  const handleResetBids = () => {
    setShowResetConfirm(true);
  };

  const confirmResetBids = () => {
    if (editingItem) {
      onUpdateItem(editingItem.id, {
        bids: [],
        totalBids: 0,
        currentBid: editingItem.startingBid
      });
      setShowResetConfirm(false);
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    }
  };

  const cancelResetBids = () => {
    setShowResetConfirm(false);
  };

  const handleCloseEdit = () => {
    setEditingItem(null);
  };

  const handleAddItem = () => {
    setShowAddForm(false);
    setAddForm({
      title: '',
      description: '',
      image: '',
      startingBid: 0,
      bidIncrement: 0,
      endDate: '',
      endTime: ''
    });
    alert('New auction item added successfully!');
  };

  const handleCloseAdd = () => {
    setShowAddForm(false);
    setAddForm({
      title: '',
      description: '',
      image: '',
      startingBid: 0,
      bidIncrement: 0,
      endDate: '',
      endTime: ''
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, formType: 'edit' | 'add') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        if (formType === 'edit') {
          setEditForm(prev => ({ ...prev, image: imageUrl }));
        } else {
          setAddForm(prev => ({ ...prev, image: imageUrl }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadItemBids = (item: AuctionItem) => {
    if (item.bids.length === 0) {
      alert('No bids to download for this item.');
      return;
    }

    const csvContent = [
      ['Item Name', 'Bidder Name', 'Email', 'Phone', 'Bid Amount', 'Timestamp'],
      ...item.bids.map(bid => [
        `"${item.title}"`,
        `"${bid.bidderName}"`,
        `"${bid.bidderEmail}"`,
        `"${bid.bidderPhone}"`,
        `"RM${bid.amount}"`,
        `"${bid.timestamp.toLocaleString()}"`
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.title.replace(/[^a-zA-Z0-9]/g, '-')}-bids-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center space-x-3 animate-fade-in">
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-check-line text-xl"></i>
            </div>
            <span className="font-semibold">Item details saved successfully!</span>
            <button 
              onClick={() => setShowSuccessPopup(false)}
              className="w-6 h-6 flex items-center justify-center hover:bg-green-600 rounded-full transition-colors cursor-pointer"
            >
              <i className="ri-close-line"></i>
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Auction Items</h2>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors whitespace-nowrap cursor-pointer flex items-center space-x-2"
        >
          <i className="ri-add-line w-5 h-5 flex items-center justify-center"></i>
          <span>Add New Item</span>
        </button>
      </div>

      <div className="grid gap-6">
        {items.map(item => (
          <div key={item.id} className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <div className="flex items-start space-x-6">
              <img 
                src={item.image} 
                alt={item.title}
                className="w-32 h-32 object-cover object-top rounded-xl flex-shrink-0"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                    <p className="text-gray-600 line-clamp-2">{item.description}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      item.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {item.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Starting Bid</p>
                    <p className="text-lg font-semibold text-gray-800">RM{item.startingBid}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Current Bid</p>
                    <p className="text-lg font-semibold text-orange-600">RM{item.currentBid}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Bids</p>
                    <p className="text-lg font-semibold text-blue-600">{item.totalBids}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Increment</p>
                    <p className="text-lg font-semibold text-gray-800">RM{item.bidIncrement}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 flex-wrap gap-2">
                  <button
                    onClick={() => onToggleStatus(item.id)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                      item.isActive
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {item.isActive ? 'Stop Auction' : 'Start Auction'}
                  </button>
                  
                  <button 
                    onClick={() => handleEditClick(item)}
                    className="px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Edit Details
                  </button>

                  <button 
                    onClick={() => downloadItemBids(item)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer flex items-center space-x-2 ${
                      item.bids.length > 0
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={item.bids.length === 0}
                  >
                    <i className="ri-download-line w-4 h-4 flex items-center justify-center"></i>
                    <span>Download Bids ({item.bids.length})</span>
                  </button>
                  
                  <button 
                    onClick={() => onDeleteItem(item.id)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingItem && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Edit Item Details</h2>
                <button 
                  onClick={handleCloseEdit}
                  className="bg-gray-100 hover:bg-gray-200 w-10 h-10 flex items-center justify-center rounded-full transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
              
              <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Item Title
                  </label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-sm"
                    placeholder="Enter item title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    maxLength={500}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none resize-none text-sm"
                    placeholder="Enter item description"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {editForm.description.length}/500 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Item Image
                  </label>
                  <div className="space-y-4">
                    {editForm.image && (
                      <div className="relative">
                        <img 
                          src={editForm.image} 
                          alt="Preview" 
                          className="w-full h-48 object-cover object-top rounded-xl border-2 border-gray-200"
                        />
                      </div>
                    )}
                    
                    <div className="flex space-x-4">
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'edit')}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-sm cursor-pointer"
                        />
                      </div>
                      <div className="text-gray-400 text-sm flex items-center">or</div>
                      <div className="flex-1">
                        <input
                          type="url"
                          value={editForm.image}
                          onChange={(e) => setEditForm(prev => ({ ...prev, image: e.target.value }))}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-sm"
                          placeholder="Enter image URL"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Starting Bid (RM)
                    </label>
                    <input
                      type="number"
                      value={editForm.startingBid}
                      onChange={(e) => setEditForm(prev => ({ ...prev, startingBid: Number(e.target.value) }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-sm"
                      placeholder="0"
                      min="1"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Bid Increment (RM)
                    </label>
                    <input
                      type="number"
                      value={editForm.bidIncrement}
                      onChange={(e) => setEditForm(prev => ({ ...prev, bidIncrement: Number(e.target.value) }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-sm"
                      placeholder="0"
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Auction End Time
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        type="date"
                        value={editForm.endDate}
                        onChange={(e) => setEditForm(prev => ({ ...prev, endDate: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-sm"
                        min={new Date().toISOString().split('T')[0]}
                      />
                      <p className="text-xs text-gray-500 mt-1">End Date</p>
                    </div>
                    <div>
                      <input
                        type="time"
                        value={editForm.endTime}
                        onChange={(e) => setEditForm(prev => ({ ...prev, endTime: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-sm"
                      />
                      <p className="text-xs text-gray-500 mt-1">End Time</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Leave empty if you don't want to set an end time. Auction will run indefinitely until manually stopped.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800">Current Status</h3>
                    {editingItem.totalBids > 0 && (
                      <button
                        type="button"
                        onClick={handleResetBids}
                        className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer text-sm flex items-center space-x-2"
                      >
                        <i className="ri-refresh-line w-4 h-4 flex items-center justify-center"></i>
                        <span>Reset Bids</span>
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Current Bid: </span>
                      <span className="font-semibold text-orange-600">RM{editingItem.currentBid}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Bids: </span>
                      <span className="font-semibold text-blue-600">{editingItem.totalBids}</span>
                    </div>
                  </div>
                  {editingItem.endTime && (
                    <div className="mt-3">
                      <span className="text-gray-600 text-sm">Current End Time: </span>
                      <span className="font-semibold text-purple-600 text-sm">
                        {new Date(editingItem.endTime).toLocaleString()}
                      </span>
                    </div>
                  )}
                  {editingItem.totalBids > 0 && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-xs text-yellow-700">
                        <i className="ri-information-line mr-1"></i>
                        Resetting bids will permanently delete all bid history and reset the current bid to the starting bid amount.
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={handleCloseEdit}
                    className="flex-1 py-4 px-6 border-2 border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 px-6 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 whitespace-nowrap cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Reset Bids Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8">
            <div className="text-center">
              <div className="w-16 h-16 flex items-center justify-center bg-red-100 rounded-full mx-auto mb-4">
                <i className="ri-alert-line text-red-600 text-2xl"></i>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Reset All Bids?</h3>
              
              <p className="text-gray-600 mb-6">
                This will permanently delete all bid history for this item and reset the current bid back to the starting bid amount. This action cannot be undone.
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <i className="ri-information-line text-yellow-600 mt-1"></i>
                  <div className="text-left">
                    <p className="text-sm text-yellow-800 font-semibold">Current Status:</p>
                    <p className="text-sm text-yellow-700">
                      Current Bid: RM{editingItem?.currentBid} → RM{editingItem?.startingBid}
                    </p>
                    <p className="text-sm text-yellow-700">
                      Total Bids: {editingItem?.totalBids} → 0
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={cancelResetBids}
                  className="flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmResetBids}
                  className="flex-1 py-3 px-6 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Reset Bids
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Add New Auction Item</h2>
                <button 
                  onClick={handleCloseAdd}
                  className="bg-gray-100 hover:bg-gray-200 w-10 h-10 flex items-center justify-center rounded-full transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
              
              <form onSubmit={(e) => { e.preventDefault(); handleAddItem(); }} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Item Title
                  </label>
                  <input
                    type="text"
                    value={addForm.title}
                    onChange={(e) => setAddForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-sm"
                    placeholder="Enter item title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={addForm.description}
                    onChange={(e) => setAddForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    maxLength={500}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none resize-none text-sm"
                    placeholder="Enter item description"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {addForm.description.length}/500 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Item Image
                  </label>
                  <div className="space-y-4">
                    {addForm.image && (
                      <div className="relative">
                        <img 
                          src={addForm.image} 
                          alt="Preview" 
                          className="w-full h-48 object-cover object-top rounded-xl border-2 border-gray-200"
                        />
                      </div>
                    )}
                    
                    <div className="flex space-x-4">
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'add')}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-sm cursor-pointer"
                        />
                      </div>
                      <div className="text-gray-400 text-sm flex items-center">or</div>
                      <div className="flex-1">
                        <input
                          type="url"
                          value={addForm.image}
                          onChange={(e) => setAddForm(prev => ({ ...prev, image: e.target.value }))}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-sm"
                          placeholder="Enter image URL"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Starting Bid (RM)
                    </label>
                    <input
                      type="number"
                      value={addForm.startingBid}
                      onChange={(e) => setAddForm(prev => ({ ...prev, startingBid: Number(e.target.value) }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-sm"
                      placeholder="0"
                      min="1"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Bid Increment (RM)
                    </label>
                    <input
                      type="number"
                      value={addForm.bidIncrement}
                      onChange={(e) => setAddForm(prev => ({ ...prev, bidIncrement: Number(e.target.value) }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-sm"
                      placeholder="0"
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Auction End Time (Optional)
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        type="date"
                        value={addForm.endDate}
                        onChange={(e) => setAddForm(prev => ({ ...prev, endDate: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-sm"
                        min={new Date().toISOString().split('T')[0]}
                      />
                      <p className="text-xs text-gray-500 mt-1">End Date</p>
                    </div>
                    <div>
                      <input
                        type="time"
                        value={addForm.endTime}
                        onChange={(e) => setAddForm(prev => ({ ...prev, endTime: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-sm"
                      />
                      <p className="text-xs text-gray-500 mt-1">End Time</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Leave empty if you don't want to set an end time. Auction will run indefinitely until manually stopped.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                  <h3 className="font-semibold text-gray-800 mb-2">Item Status</h3>
                  <p className="text-sm text-gray-600">New items are created as inactive by default. You can activate them after creation.</p>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={handleCloseAdd}
                    className="flex-1 py-4 px-6 border-2 border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 px-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all transform hover:scale-105 whitespace-nowrap cursor-pointer"
                  >
                    Add Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
