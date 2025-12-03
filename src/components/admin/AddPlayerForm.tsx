'use client';

import { useState } from 'react';

export function AddPlayerForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [position, setPosition] = useState('PG');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/admin/add-player', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName,
        lastName,
        position,
        height: parseInt(height),
        weight: parseInt(weight),
      }),
    });

    const data = await res.json();
    setMessage(data.message || 'Player added');

    if (data.success) {
      setFirstName('');
      setLastName('');
      setHeight('');
      setWeight('');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Add Player</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Position</label>
          <select
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="PG">Point Guard</option>
            <option value="SG">Shooting Guard</option>
            <option value="SF">Small Forward</option>
            <option value="PF">Power Forward</option>
            <option value="C">Center</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Height (inches)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Weight (lbs)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-primary-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary-600"
        >
          Add Player
        </button>
        {message && (
          <p className="text-sm text-gray-600 mt-2">{message}</p>
        )}
      </form>
    </div>
  );
}
