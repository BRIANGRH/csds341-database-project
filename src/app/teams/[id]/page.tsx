import Link from 'next/link';
import { getTeamById, getPlayersByTeam, getGamesByTeam, getAvailableSeasons, getTeamSeasonStats } from '@/lib/queries';
import { notFound } from 'next/navigation';
import { TeamSeasonStats } from '@/components/ui/TeamSeasonStats';

interface TeamPageProps {
  params: Promise<{ id: string }>;
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { id } = await params;
  const teamId = parseInt(id);

  if (isNaN(teamId)) {
    notFound();
  }

  const [team, players, recentGames, seasons] = await Promise.all([
    getTeamById(teamId),
    getPlayersByTeam(teamId),
    getGamesByTeam(teamId, 5),
    getAvailableSeasons(),
  ]);

  if (!team) {
    notFound();
  }

  const currentSeason = seasons[0];
  const seasonStats = currentSeason ? await getTeamSeasonStats(teamId, currentSeason) : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm p-8 mb-8 border-b border-gray-200">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">
          {team.city} {team.teamname}
        </h1>
        <div className="flex gap-6 text-lg text-gray-600">
          <p><span className="font-semibold">Conference:</span> {team.conference}</p>
          <p><span className="font-semibold">Division:</span> {team.division}</p>
          <p><span className="font-semibold">Founded:</span> {team.foundedyear}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <TeamSeasonStats teamId={teamId} seasons={seasons} initialStats={seasonStats} />

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Current Roster</h2>
            {players.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left">Player</th>
                      <th className="px-4 py-2 text-left">Position</th>
                      <th className="px-4 py-2 text-left">Height</th>
                      <th className="px-4 py-2 text-left">Weight</th>
                    </tr>
                  </thead>
                  <tbody>
                    {players.map((player) => (
                      <tr key={player.playerid} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <Link
                            href={`/players/${player.playerid}`}
                            className="text-blue-600 hover:text-blue-800 font-semibold"
                          >
                            {player.firstname} {player.lastname}
                          </Link>
                        </td>
                        <td className="px-4 py-3">{player.position}</td>
                        <td className="px-4 py-3">
                          {Math.floor(player.height / 12)}'{player.height % 12}"
                        </td>
                        <td className="px-4 py-3">{player.weight} lbs</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600">No players currently on this team.</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Recent Games</h3>
            {recentGames.length > 0 ? (
              <div className="space-y-3">
                {recentGames.map((game) => {
                  const isHome = game.hometeamid === teamId;
                  const teamScore = isHome ? game.homescore : game.awayscore;
                  const oppScore = isHome ? game.awayscore : game.homescore;
                  const oppName = isHome ? game.awayteamname : game.hometeamname;
                  const won = teamScore > oppScore;

                  return (
                    <Link
                      key={game.gameid}
                      href={`/games/${game.gameid}`}
                      className="block p-3 border rounded hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className={`font-bold ${won ? 'text-green-600' : 'text-red-600'}`}>
                          {won ? 'W' : 'L'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(game.gamedate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">vs {oppName}</span>
                        <span className="font-bold">
                          {teamScore}-{oppScore}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-600 text-sm">No recent games available.</p>
            )}
            <Link
              href={`/games?team=${teamId}`}
              className="block mt-4 text-blue-600 hover:text-blue-800 text-sm font-semibold"
            >
              View all games →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
