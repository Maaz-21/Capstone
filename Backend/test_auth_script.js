import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/users';
const email = `test_${Date.now()}@example.com`;
const password = 'password123';

async function testAuth() {
    try {
        console.log('1. Registering...');
        await axios.post(`${BASE_URL}/register`, {
            name: 'Test User',
            email,
            password
        });
        console.log('   Registered:', email);

        console.log('2. Logging in...');
        const loginRes = await axios.post(`${BASE_URL}/login`, {
            email,
            password
        });
        const { accessToken } = loginRes.data;
        console.log('   Login Success. Access Token:', accessToken.substring(0, 20) + '...');

        console.log('3. Accessing Watchlist...');
        const watchlistRes = await axios.get(`${BASE_URL}/watchlist`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        console.log('   Watchlist Access Success. Items:', watchlistRes.data.length);

    } catch (error) {
        console.error('ERROR:', error.response ? error.response.data : error.message);
    }
}

testAuth();
