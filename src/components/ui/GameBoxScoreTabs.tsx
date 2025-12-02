'use client';

import Link from 'next/link';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';

interface BoxScoreStat {
  statid: number;
  playerid: number;
  firstname: string;
  lastname: string;
  position: string;
  minutesplayed: number;
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fieldgoalsmade: number;
  fieldgoalsattempted: number;
  threepointersmade: number;
  threepointersattempted: number;
  freethrowsmade: number;
  freethrowsattempted: number;
}

interface GameBoxScoreTabsProps {
  awayTeamName: string;
  homeTeamName: string;
  awayTeamCity: string;
  homeTeamCity: string;
  awayBoxScore: BoxScoreStat[];
  homeBoxScore: BoxScoreStat[];
}

export function GameBoxScoreTabs({
  awayTeamName,
  homeTeamName,
  awayTeamCity,
  homeTeamCity,
  awayBoxScore,
  homeBoxScore,
}: GameBoxScoreTabsProps) {
  const renderBoxScoreTable = (boxScore: BoxScoreStat[]) => {
    if (boxScore.length === 0) {
      return <p className="px-6 py-4 text-gray-600">No player statistics available for this team.</p>;
    }

    const topScorer = boxScore.reduce((max, player) =>
      player.points > max.points ? player : max
    , boxScore[0]);

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Player</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">POS</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">MIN</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">PTS</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">REB</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">AST</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">STL</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">BLK</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">TO</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">FG</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">3PT</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">FT</th>
            </tr>
          </thead>
          <tbody>
            {boxScore.map((stat) => {
              const isTopScorer = stat.statid === topScorer.statid;
              return (
                <tr key={stat.statid} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/players/${stat.playerid}`}
                      className="text-gray-900 hover:text-primary-500 font-semibold"
                    >
                      {stat.firstname} {stat.lastname}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-center text-xs font-semibold text-primary-500 uppercase tracking-wide">{stat.position}</td>
                  <td className="px-4 py-3 text-center text-gray-600 tabular-nums">{stat.minutesplayed}</td>
                  <td className={`px-4 py-3 text-center font-bold tabular-nums ${
                    isTopScorer ? 'text-primary-600' : 'text-gray-900'
                  }`}>
                    {stat.points}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-900 tabular-nums">{stat.rebounds}</td>
                  <td className="px-4 py-3 text-center text-gray-900 tabular-nums">{stat.assists}</td>
                  <td className="px-4 py-3 text-center text-gray-600 tabular-nums">{stat.steals}</td>
                  <td className="px-4 py-3 text-center text-gray-600 tabular-nums">{stat.blocks}</td>
                  <td className="px-4 py-3 text-center text-gray-500 tabular-nums">{stat.turnovers}</td>
                  <td className="px-4 py-3 text-center text-xs text-gray-600 tabular-nums">
                    {stat.fieldgoalsmade}-{stat.fieldgoalsattempted}
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-gray-600 tabular-nums">
                    {stat.threepointersmade}-{stat.threepointersattempted}
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-gray-600 tabular-nums">
                    {stat.freethrowsmade}-{stat.freethrowsattempted}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <TabGroup>
        <TabList className="flex border-b border-gray-200">
          <Tab className="flex-1 py-4 px-6 text-sm font-semibold tracking-tight text-gray-500 focus:outline-none data-[selected]:text-primary-600 data-[selected]:border-b-2 data-[selected]:border-primary-500 data-[hover]:text-gray-700 -mb-px">
            {awayTeamCity} {awayTeamName}
          </Tab>
          <Tab className="flex-1 py-4 px-6 text-sm font-semibold tracking-tight text-gray-500 focus:outline-none data-[selected]:text-primary-600 data-[selected]:border-b-2 data-[selected]:border-primary-500 data-[hover]:text-gray-700 -mb-px">
            {homeTeamCity} {homeTeamName}
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel className="p-0">
            {renderBoxScoreTable(awayBoxScore)}
          </TabPanel>
          <TabPanel className="p-0">
            {renderBoxScoreTable(homeBoxScore)}
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
}
