'use client';

import { useState, useEffect } from 'react';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';

interface SeasonStats {
  season: string;
  wins: number;
  losses: number;
  pointspergame: number | string;
  reboundspergame: number | string;
  assistspergame: number | string;
}

interface TeamSeasonStatsProps {
  teamId: number;
  seasons: string[];
  initialStats: SeasonStats | null;
}

export function TeamSeasonStats({ teamId, seasons, initialStats }: TeamSeasonStatsProps) {
  const [selectedSeason, setSelectedSeason] = useState(seasons[0] || '2024-25');
  const [stats, setStats] = useState<SeasonStats | null>(initialStats);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedSeason !== seasons[0]) {
      setLoading(true);
      fetch(`/api/team-stats?teamId=${teamId}&season=${selectedSeason}`)
        .then(res => res.json())
        .then(data => {
          setStats(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [selectedSeason, teamId, seasons]);

  if (!stats && !loading) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Season Statistics</h2>

        {seasons.length > 1 && (
          <Listbox value={selectedSeason} onChange={setSelectedSeason}>
            <div className="relative">
              <ListboxButton className="relative w-40 cursor-pointer rounded-lg bg-gray-100 py-2 pl-3 pr-10 text-left focus:outline-none focus:ring-2 focus:ring-gray-900">
                <span className="block truncate font-medium text-gray-900">{selectedSeason}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" clipRule="evenodd" />
                  </svg>
                </span>
              </ListboxButton>
              <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {seasons.map((season) => (
                  <ListboxOption
                    key={season}
                    value={season}
                    className="relative cursor-pointer select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-gray-100"
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                          {season}
                        </span>
                        {selected && (
                          <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-900">
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                            </svg>
                          </span>
                        )}
                      </>
                    )}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </div>
          </Listbox>
        )}
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-600">Loading...</div>
      ) : stats ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">Wins</p>
            <p className="text-3xl font-bold text-gray-900">{stats.wins}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">Losses</p>
            <p className="text-3xl font-bold text-gray-900">{stats.losses}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">Win %</p>
            <p className="text-3xl font-bold text-gray-900">
              {((stats.wins / (stats.wins + stats.losses)) * 100).toFixed(1)}%
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">PPG</p>
            <p className="text-3xl font-bold text-gray-900">
              {Number(stats.pointspergame).toFixed(1)}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">RPG</p>
            <p className="text-3xl font-bold text-gray-900">
              {Number(stats.reboundspergame).toFixed(1)}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">APG</p>
            <p className="text-3xl font-bold text-gray-900">
              {Number(stats.assistspergame).toFixed(1)}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-600">No stats available</div>
      )}
    </div>
  );
}
