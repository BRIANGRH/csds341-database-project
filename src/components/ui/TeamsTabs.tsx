'use client';

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { TeamCard } from './TeamCard';

interface Team {
  teamid: number;
  teamname: string;
  city: string;
  conference: string;
  division: string;
  foundedyear: number;
}

interface TeamsTabsProps {
  eastTeams: Team[];
  westTeams: Team[];
}

export function TeamsTabs({ eastTeams, westTeams }: TeamsTabsProps) {
  return (
    <TabGroup>
      <TabList className="flex space-x-2 border-b border-gray-200 mb-8">
        <Tab className="px-6 py-3 text-sm font-semibold tracking-tight text-gray-500 focus:outline-none data-[selected]:text-gray-900 data-[selected]:border-b-2 data-[selected]:border-gray-900 data-[hover]:text-gray-700 -mb-px">
          Eastern ({eastTeams.length})
        </Tab>
        <Tab className="px-6 py-3 text-sm font-semibold tracking-tight text-gray-500 focus:outline-none data-[selected]:text-gray-900 data-[selected]:border-b-2 data-[selected]:border-gray-900 data-[hover]:text-gray-700 -mb-px">
          Western ({westTeams.length})
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eastTeams.map((team) => (
              <TeamCard
                key={team.teamid}
                teamId={team.teamid}
                teamName={team.teamname}
                city={team.city}
                conference={team.conference}
                division={team.division}
                foundedYear={team.foundedyear}
              />
            ))}
          </div>
        </TabPanel>
        <TabPanel>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {westTeams.map((team) => (
              <TeamCard
                key={team.teamid}
                teamId={team.teamid}
                teamName={team.teamname}
                city={team.city}
                conference={team.conference}
                division={team.division}
                foundedYear={team.foundedyear}
              />
            ))}
          </div>
        </TabPanel>
      </TabPanels>
    </TabGroup>
  );
}
