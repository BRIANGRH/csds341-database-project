'use client';

import { useState } from 'react';

export function TradePlayerForm() {
  const [playerId, setPlayerId] = useState('');
  const [fromTeamId, setFromTeamId] = useState('');
  const [toTeamId, setToTeamId] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/admin/trade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        playerId: parseInt(playerId),
        fromTeamId: parseInt(fromTeamId),
        toTeamId: parseInt(toTeamId),
      }),
    });

    const data = await res.json();
    setMessage(data.message || 'Trade completed');

    if (data.success) {
      setPlayerId('');
      setFromTeamId('');
      setToTeamId('');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Trade Player</h2>
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
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">From Team ID</label>
          <input
            type="number"
            value={fromTeamId}
            onChange={(e) => setFromTeamId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">To Team ID</label>
          <input
            type="number"
            value={toTeamId}
            onChange={(e) => setToTeamId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary-600"
        >
          Trade Player
        </button>
        {message && (
          <p className="text-sm text-gray-600 mt-2">{message}</p>
        )}
      </form>
    </div>
  );
}
