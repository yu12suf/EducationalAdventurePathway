'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';

export default function TestPage() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/api/test')
      .then(res => setMessage(res.data.message))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl">Backend says: {message}</h1>
    </div>
  );
}