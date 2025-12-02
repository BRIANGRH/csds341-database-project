import { getAllTeams } from '@/lib/queries';
import { PageHeader } from '@/components/ui/PageHeader';
import { TeamsTabs } from '@/components/ui/TeamsTabs';

export default async function TeamsPage() {
  const teams = await getAllTeams();

  const eastTeams = teams.filter(team => team.conference === 'East');
  const westTeams = teams.filter(team => team.conference === 'West');

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="NBA Teams" />

      <TeamsTabs eastTeams={eastTeams} westTeams={westTeams} />

      {teams.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No teams found in the database.</p>
          <p className="text-gray-500 text-sm mt-2">Please add teams to your database to see them here.</p>
        </div>
      )}
    </div>
  );
}
