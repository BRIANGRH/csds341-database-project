import Link from 'next/link';
import { getDashboardStats } from '@/lib/queries';
import { StatCard } from '@/components/ui/Card';
import { GameCard } from '@/components/ui/GameCard';
import { Button } from '@/components/ui/Button';

export default async function Home() {
  let stats;
  let error = null;

  try {
    stats = await getDashboardStats();
  } catch (e) {
    error = 'Failed to connect to database. Please check your database configuration.';
    console.error('Database error:', e);
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-16">
        <h1 className="text-6xl font-black tracking-tight text-gray-900 mb-3">
          NBA Stats<span className="text-primary-500">.</span>
        </h1>
        <p className="text-xl text-gray-500">Professional Basketball Statistics</p>
      </div>

      {error ? (
        <div className="bg-error/10 border border-error text-error px-4 py-3 rounded mb-8">
          <p className="font-bold">Database Connection Error</p>
          <p>{error}</p>
          <p className="text-sm mt-2">Please update your .env.local file with the correct database credentials.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="Total Teams"
              value={stats?.totalTeams || 0}
              subtitle={<Link href="/teams" className="text-primary-600 hover:text-primary-700 text-sm font-semibold">View all teams →</Link>}
              variant="primary"
            />
            <StatCard
              title="Total Players"
              value={stats?.totalPlayers || 0}
              subtitle={<Link href="/players" className="text-primary-600 hover:text-primary-700 text-sm font-semibold">View all players →</Link>}
              variant="primary"
            />
            <StatCard
              title="Total Games"
              value={stats?.totalGames || 0}
              subtitle={<Link href="/games" className="text-primary-600 hover:text-primary-700 text-sm font-semibold">View all games →</Link>}
              variant="primary"
            />
          </div>

          {stats?.recentGames && stats.recentGames.length > 0 && (
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-6 text-gray-900 tracking-tight">
                Recent Games
              </h2>
              <div className="space-y-4">
                {stats.recentGames.map((game: any) => (
                  <GameCard
                    key={game.gameid}
                    gameId={game.gameid}
                    gameDate={game.gamedate}
                    homeTeamName={game.hometeamname}
                    awayTeamName={game.awayteamname}
                    homeTeamCity={game.hometeamcity}
                    awayTeamCity={game.awayteamcity}
                    homeScore={game.homescore}
                    awayScore={game.awayscore}
                    season={game.season}
                    gameType={game.gametype}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
}
