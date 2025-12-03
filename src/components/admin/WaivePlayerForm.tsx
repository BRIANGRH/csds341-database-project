'use client';

import { useState } from 'react';

export function WaivePlayerForm() {
  const [playerId, setPlayerId] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/admin/waive', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        playerId: parseInt(playerId),
      }),
    });

    const data = await res.json();
    setMessage(data.message || 'Player waived');

    if (data.success) {
      setPlayerId('');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Waive Player</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Player ID</label>
          <input
            type="number"
            value={playerId}
            onChange={(e) => setPlayerId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-700"
        >
          Waive Player
        </button>
        {message && (
          <p className="text-sm text-gray-600 mt-2">{message}</p>
        )}
      </form>
    </div>
  );
}
