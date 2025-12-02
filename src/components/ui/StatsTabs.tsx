'use client';

import Link from 'next/link';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';

interface Leader {
  playerid: number;
  firstname: string;
  lastname: string;
  teamname: string;
  value: number | string;
}

interface StatsTabsProps {
  pointsLeaders: Leader[];
  reboundsLeaders: Leader[];
  assistsLeaders: Leader[];
}

export function StatsTabs({ pointsLeaders, reboundsLeaders, assistsLeaders }: StatsTabsProps) {
  const renderLeaderList = (leaders: Leader[]) => (
    leaders.length > 0 ? (
      <div className="space-y-3">
        {leaders.map((leader, index) => (
          <div
            key={leader.playerid}
            className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className={`text-xl font-bold w-6 ${
                index === 0 ? 'text-primary-500' : 'text-gray-400'
              }`}>
                {index + 1}
              </span>
              <div>
                <Link
                  href={`/players/${leader.playerid}`}
                  className="font-semibold text-gray-900 hover:text-primary-500"
                >
                  {leader.firstname} {leader.lastname}
                </Link>
                <p className="text-xs text-gray-600">{leader.teamname}</p>
              </div>
            </div>
            <span className={`text-2xl font-bold tabular-nums ${
              index === 0 ? 'text-primary-600' : 'text-gray-900'
            }`}>
              {Number(leader.value).toFixed(1)}
            </span>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-600 text-center py-4">No data available</p>
    )
  );

  return (
    <div className="mb-12">
      <TabGroup>
        <TabList className="flex space-x-2 border-b border-gray-200">
          <Tab className="px-6 py-3 text-sm font-semibold tracking-tight text-gray-500 focus:outline-none data-[selected]:text-primary-600 data-[selected]:border-b-2 data-[selected]:border-primary-500 data-[hover]:text-gray-700 -mb-px">
            Points
          </Tab>
          <Tab className="px-6 py-3 text-sm font-semibold tracking-tight text-gray-500 focus:outline-none data-[selected]:text-primary-600 data-[selected]:border-b-2 data-[selected]:border-primary-500 data-[hover]:text-gray-700 -mb-px">
            Rebounds
          </Tab>
          <Tab className="px-6 py-3 text-sm font-semibold tracking-tight text-gray-500 focus:outline-none data-[selected]:text-primary-600 data-[selected]:border-b-2 data-[selected]:border-primary-500 data-[hover]:text-gray-700 -mb-px">
            Assists
          </Tab>
        </TabList>
        <TabPanels className="mt-6">
          <TabPanel className="bg-white rounded-xl border border-gray-100 p-6">
            {renderLeaderList(pointsLeaders)}
          </TabPanel>
          <TabPanel className="bg-white rounded-xl border border-gray-100 p-6">
            {renderLeaderList(reboundsLeaders)}
          </TabPanel>
          <TabPanel className="bg-white rounded-xl border border-gray-100 p-6">
            {renderLeaderList(assistsLeaders)}
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
}
