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
    <div className="container mx-auto px-4 py-12">
      <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
        <h1 className="text-5xl font-black tracking-tight text-gray-900 mb-4">
          {team.city} {team.teamname}
        </h1>
        <div className="flex gap-6 text-sm">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Conference</span>
            <span className="text-lg font-semibold text-gray-900">{team.conference}</span>
          </div>
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Division</span>
            <span className="text-lg font-semibold text-gray-900">{team.division}</span>
          </div>
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Founded</span>
            <span className="text-lg font-semibold text-gray-900">{team.foundedyear}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <TeamSeasonStats teamId={teamId} seasons={seasons} initialStats={seasonStats} />

          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 tracking-tight">Current Roster</h2>
            {players.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Player</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Position</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Height</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Weight</th>
                    </tr>
                  </thead>
                  <tbody>
                    {players.map((player) => (
                      <tr key={player.playerid} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <Link
                            href={`/players/${player.playerid}`}
                            className="text-gray-900 hover:text-primary-500 font-semibold"
                          >
                            {player.firstname} {player.lastname}
                          </Link>
                        </td>
                        <td className="px-4 py-4 text-xs font-semibold text-primary-500 uppercase tracking-wide">{player.position}</td>
                        <td className="px-4 py-4 text-gray-600">
                          {Math.floor(player.height / 12)}'{player.height % 12}"
                        </td>
                        <td className="px-4 py-4 text-gray-600">{player.weight} lbs</td>
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
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="text-2xl font-bold mb-4 text-gray-900 tracking-tight">Recent Games</h3>
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
                      className="block p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className={`text-xs font-bold px-2 py-1 rounded ${won ? 'bg-primary-50 text-primary-600' : 'bg-gray-100 text-gray-600'}`}>
                          {won ? 'W' : 'L'}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">
                          {new Date(game.gamedate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">vs {oppName}</span>
                        <span className="text-lg font-bold text-gray-900 tabular-nums">
                          {teamScore}–{oppScore}
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
              className="block mt-4 text-primary-500 hover:text-primary-600 text-sm font-semibold"
            >
              View all games →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
