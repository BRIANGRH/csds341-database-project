'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';

interface Player {
  playerid: number;
  firstname: string;
  lastname: string;
  position: string;
  height: number;
  weight: number;
  teamname: string | null;
  teamcity: string | null;
}

interface PlayersFilterProps {
  players: Player[];
}

const positions = ['All', 'PG', 'SG', 'SF', 'PF', 'C'] as const;
const positionNames: Record<string, string> = {
  All: 'All Positions',
  PG: 'Point Guards',
  SG: 'Shooting Guards',
  SF: 'Small Forwards',
  PF: 'Power Forwards',
  C: 'Centers',
};

export function PlayersFilter({ players }: PlayersFilterProps) {
  const [selectedPosition, setSelectedPosition] = useState<string>('All');

  const filteredPlayers = selectedPosition === 'All'
    ? players
    : players.filter(p => p.position === selectedPosition);

  const groupedPlayers: Record<string, Player[]> = {};
  if (selectedPosition === 'All') {
    positions.slice(1).forEach(pos => {
      groupedPlayers[pos] = players.filter(p => p.position === pos);
    });
  } else {
    groupedPlayers[selectedPosition] = filteredPlayers;
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-gray-600">
          Showing {filteredPlayers.length} player{filteredPlayers.length !== 1 ? 's' : ''}
        </p>
        <Listbox value={selectedPosition} onChange={setSelectedPosition}>
          <div className="relative">
            <ListboxButton className="relative w-56 cursor-pointer rounded-lg bg-gray-100 py-2.5 pl-3 pr-10 text-left focus:outline-none focus:ring-2 focus:ring-gray-900">
              <span className="block truncate font-medium text-gray-900">
                {positionNames[selectedPosition]}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" clipRule="evenodd" />
                </svg>
              </span>
            </ListboxButton>
            <ListboxOptions className="absolute right-0 z-10 mt-1 w-56 overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {positions.map((position) => (
                <ListboxOption
                  key={position}
                  value={position}
                  className="relative cursor-pointer select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-gray-100"
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                        {positionNames[position]}
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
      </div>

      {Object.entries(groupedPlayers).map(([position, posPlayers]) => {
        if (posPlayers.length === 0) return null;

        return (
          <div key={position} className="mb-12">
            {selectedPosition === 'All' && (
              <h2 className="text-2xl font-bold mb-6 text-gray-900 tracking-tight">
                {positionNames[position]} <span className="text-primary-500 font-normal">({posPlayers.length})</span>
              </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {posPlayers.map((player) => (
                <Link
                  key={player.playerid}
                  href={`/players/${player.playerid}`}
                  className="group bg-white rounded-xl border border-gray-100 p-5 card-hover"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-500 transition-colors">
                        {player.firstname} {player.lastname}
                      </h3>
                      <p className="text-xs font-semibold text-primary-500 uppercase tracking-wide mt-0.5">
                        {player.position}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">
                        {Math.floor(player.height / 12)}'{player.height % 12}" • {player.weight} lbs
                      </span>
                    </div>
                    {player.teamname ? (
                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                          {player.teamcity} {player.teamname}
                        </p>
                      </div>
                    ) : (
                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-xs text-gray-400 italic">Free Agent</p>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
      })}

      {filteredPlayers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No players found for this position.</p>
        </div>
      )}
    </>
  );
}
