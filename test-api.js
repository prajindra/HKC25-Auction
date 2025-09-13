// Simple test script to verify API endpoints
const testAPI = async () => {
  const baseURL = 'http://localhost:3000/api/auction';
  
  try {
    console.log('Testing API endpoints...\n');
    
    // Test 1: Fetch all auction items
    console.log('1. Testing GET /api/auction');
    const response = await fetch(baseURL);
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Successfully fetched auction items');
      console.log(`   Found ${data.data.length} items`);
      
      if (data.data.length > 0) {
        const firstItem = data.data[0];
        console.log(`   First item: ${firstItem.title}`);
        
        // Test 2: Fetch specific item
        console.log('\n2. Testing GET /api/auction/[id]');
        const itemResponse = await fetch(`${baseURL}/${firstItem.id}`);
        const itemData = await itemResponse.json();
        
        if (itemData.success) {
          console.log('✅ Successfully fetched specific item');
          console.log(`   Item: ${itemData.data.title}`);
        } else {
          console.log('❌ Failed to fetch specific item:', itemData.error);
        }
        
        // Test 3: Toggle item status
        console.log('\n3. Testing POST /api/auction/[id]/toggle');
        const toggleResponse = await fetch(`${baseURL}/${firstItem.id}/toggle`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        const toggleData = await toggleResponse.json();
        
        if (toggleData.success) {
          console.log('✅ Successfully toggled item status');
          console.log(`   New status: ${toggleData.data.isActive ? 'Active' : 'Inactive'}`);
        } else {
          console.log('❌ Failed to toggle item status:', toggleData.error);
        }
        
        // Test 4: Place a bid (if item is active)
        if (toggleData.success && toggleData.data.isActive) {
          console.log('\n4. Testing POST /api/auction/[id]/bid');
          const bidResponse = await fetch(`${baseURL}/${firstItem.id}/bid`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              amount: firstItem.currentBid + firstItem.bidIncrement,
              bidderName: 'Test Bidder',
              bidderEmail: 'test@example.com',
              bidderPhone: '+1234567890'
            })
          });
          const bidData = await bidResponse.json();
          
          if (bidData.success) {
            console.log('✅ Successfully placed bid');
            console.log(`   New current bid: RM${bidData.data.currentBid}`);
            console.log(`   Total bids: ${bidData.data.totalBids}`);
          } else {
            console.log('❌ Failed to place bid:', bidData.error);
          }
        }
      }
    } else {
      console.log('❌ Failed to fetch auction items:', data.error);
    }
    
    console.log('\n🎉 API testing completed!');
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
    console.log('\n💡 Make sure the development server is running on http://localhost:3000');
  }
};

// Run the test
testAPI();
