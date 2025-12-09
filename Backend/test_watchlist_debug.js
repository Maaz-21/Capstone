const BASE_URL = 'http://localhost:5000/api/users';
const email = `test_wl_${Date.now()}@example.com`;
const password = 'password123';

async function runTest() {
  try {
    // 1. Register
    console.log('1. Registering...');
    const regRes = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'WL Tester', email, password })
    });
    const regData = await regRes.json();
    if (!regRes.ok) throw new Error(regData.message);
    console.log('   Registered:', email);

    // 2. Login
    console.log('2. Logging in...');
    const loginRes = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const loginData = await loginRes.json();
    if (!loginRes.ok) throw new Error(loginData.message);
    const token = loginData.accessToken;
    console.log('   Logged in.');

    const headers = { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // 3. Add Item to Watchlist
    const itemId = "5507";
    console.log(`3. Adding item ${itemId} to watchlist...`);
    const addRes = await fetch(`${BASE_URL}/watchlist`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ itemId })
    });
    const addData = await addRes.json();
    console.log('   Current Watchlist:', addData);

    // 4. Verify it's there
    if (!addData.includes(itemId) && !addData.some(i => i == itemId)) {
      console.error('   FAILED: Item not added.');
      return;
    }

    // 5. Remove Item
    console.log(`5. Removing item ${itemId}...`);
    const delRes = await fetch(`${BASE_URL}/watchlist/${itemId}`, {
      method: 'DELETE',
      headers
    });
    const delData = await delRes.json();
    console.log('   Watchlist after removal:', delData);

    // 6. Verify removal
    if (delData.includes(itemId) || delData.some(i => i == itemId)) {
      console.error('   FAILED: Item still in watchlist!');
    } else {
      console.log('   SUCCESS: Item removed.');
    }

  } catch (err) {
    console.error('TEST ERROR:', err);
  }
}

runTest();
