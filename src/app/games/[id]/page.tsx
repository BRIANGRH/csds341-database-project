import Link from 'next/link';
import { getGameById, getGameBoxScore } from '@/lib/queries';
import { notFound } from 'next/navigation';
import { query } from '@/lib/db';
import { GameBoxScoreTabs } from '@/components/ui/GameBoxScoreTabs';

interface GamePageProps {
  params: Promise<{ id: string }>;
}

export default async function GamePage({ params }: GamePageProps) {
  const { id } = await params;
  const gameId = parseInt(id);

  if (isNaN(gameId)) {
    notFound();
  }

  const game = await getGameById(gameId);

  if (!game) {
    notFound();
  }

  const boxScoreResult = await query(`
    SELECT
      pgs.*,
      p.firstname,
      p.lastname,
      p.position
    FROM PlayerGameStats pgs
    JOIN Players p ON pgs.playerid = p.playerid
    WHERE pgs.gameid = $1
    ORDER BY pgs.teamid, pgs.points DESC
  `, [gameId]);

  const boxScore = boxScoreResult.rows;

  const homeBoxScore = boxScore.filter((s: any) => s.teamid === game.hometeamid);
  const awayBoxScore = boxScore.filter((s: any) => s.teamid === game.awayteamid);

  const awayWon = game.awayscore > game.homescore;
  const homeWon = game.homescore > game.awayscore;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
        <div className="text-center mb-6">
          <p className="text-gray-600 mb-2 font-medium">
            {new Date(game.gamedate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <div className="flex items-center justify-center gap-2">
            <p className="text-sm text-gray-500">
              {game.season} Season
            </p>
            <span className="text-gray-300">•</span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              game.gametype === 'Playoff'
                ? 'bg-primary-50 text-primary-600'
                : 'bg-gray-50 text-gray-600'
            }`}>
              {game.gametype}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8 items-center max-w-4xl mx-auto">
          <div className="text-center">
            <Link
              href={`/teams/${game.awayteamid}`}
              className="group"
            >
              <h2 className={`text-2xl font-bold mb-2 ${
                awayWon ? 'text-gray-900' : 'text-gray-400'
              } group-hover:text-primary-500 transition-colors`}>
                {game.awayteamcity}
              </h2>
              <h3 className={`text-xl ${
                awayWon ? 'text-gray-700' : 'text-gray-400'
              } group-hover:text-primary-500 transition-colors`}>{game.awayteamname}</h3>
            </Link>
            <p className="text-xs text-gray-500 mt-2 uppercase tracking-wider font-semibold">
              Away {awayWon && <span className="text-primary-500 ml-1">• Winner</span>}
            </p>
          </div>

          <div className="text-center">
            <div className="text-5xl font-black tabular-nums">
              <span className={awayWon ? 'text-primary-600' : 'text-gray-400'}>{game.awayscore}</span>
              <span className="text-gray-300 mx-3">–</span>
              <span className={homeWon ? 'text-primary-600' : 'text-gray-400'}>{game.homescore}</span>
            </div>
            <p className="text-xs text-gray-500 mt-3 uppercase tracking-wider font-semibold">Final</p>
          </div>

          <div className="text-center">
            <Link
              href={`/teams/${game.hometeamid}`}
              className="group"
            >
              <h2 className={`text-2xl font-bold mb-2 ${
                homeWon ? 'text-gray-900' : 'text-gray-400'
              } group-hover:text-primary-500 transition-colors`}>
                {game.hometeamcity}
              </h2>
              <h3 className={`text-xl ${
                homeWon ? 'text-gray-700' : 'text-gray-400'
              } group-hover:text-primary-500 transition-colors`}>{game.hometeamname}</h3>
            </Link>
            <p className="text-xs text-gray-500 mt-2 uppercase tracking-wider font-semibold">
              Home {homeWon && <span className="text-primary-500 ml-1">• Winner</span>}
            </p>
          </div>
        </div>
      </div>

      <GameBoxScoreTabs
        awayTeamName={game.awayteamname}
        homeTeamName={game.hometeamname}
        awayTeamCity={game.awayteamcity}
        homeTeamCity={game.hometeamcity}
        awayBoxScore={awayBoxScore}
        homeBoxScore={homeBoxScore}
      />
    </div>
  );
}
