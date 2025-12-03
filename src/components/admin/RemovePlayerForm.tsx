'use client';

import { useState } from 'react';

export function RemovePlayerForm() {
  const [playerId, setPlayerId] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const confirmed = confirm('Are you sure you want to permanently delete this player?');
    if (!confirmed) return;

    const res = await fetch('/api/admin/remove', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        playerId: parseInt(playerId),
      }),
    });

    const data = await res.json();
    setMessage(data.message || 'Player removed');

    if (data.success) {
      setPlayerId('');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-red-200 p-6">
      <h2 className="text-2xl font-bold mb-4 text-red-600">Remove Player</h2>
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
          className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700"
        >
          Delete Player
        </button>
        {message && (
          <p className="text-sm text-gray-600 mt-2">{message}</p>
        )}
      </form>
    </div>
  );
}
