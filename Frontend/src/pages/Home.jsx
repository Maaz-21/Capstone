import axios from 'axios';
import { useEffect, useState } from 'react';
import { fetchTestMessage } from '../api/test';
import Navbar from '../components/Navbar';
function Home() {
    const [message, setMessage] = useState("");
    useEffect(() => {
        fetchTestMessage()
            .then(res => setMessage(res.message))
            .catch(err => setMessage('Error: ' + err.message));
    }, []);
    return (
        <div>
            <Navbar />
            <h1>Welcome to the Home Page</h1>
            <p>message: {message}</p>
        </div>
    );
}

export default Home;