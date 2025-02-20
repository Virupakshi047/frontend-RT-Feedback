import { useEffect, useState } from 'react';

const Home = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Call the NestJS API endpoint
    fetch('http://localhost:3001/api/hello')
      .then((res) => res.text())
      .then((data) => setMessage(data))
      .catch((error) => console.error('Error fetching API:', error));
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Next.js Frontend</h1>
      <p>Message from NestJS API: {message}</p>
    </div>
  );
};

export default Home;