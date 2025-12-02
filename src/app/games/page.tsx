import Link from 'next/link';
import { getAllGames } from '@/lib/queries';

export default async function GamesPage() {
  const games = await getAllGames();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-5xl font-black tracking-tight text-gray-900">Games</h1>
        <p className="text-lg text-gray-500 mt-3">{games.length} games total</p>
      </div>

      {games.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Matchup
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Season
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">

                  </th>
                </tr>
              </thead>
              <tbody>
                {games.map((game) => {
                  const awayWon = game.awayscore > game.homescore;
                  const homeWon = game.homescore > game.awayscore;

                  return (
                    <tr
                      key={game.gameid}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-5 text-sm font-medium text-gray-500">
                        {new Date(game.gamedate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-semibold ${awayWon ? 'text-gray-900' : 'text-gray-400'}`}>
                              {game.awayteamcity} {game.awayteamname}
                            </span>
                            {awayWon && <span className="text-xs font-bold text-primary-500">W</span>}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-semibold ${homeWon ? 'text-gray-900' : 'text-gray-400'}`}>
                              {game.hometeamcity} {game.hometeamname}
                            </span>
                            {homeWon && <span className="text-xs font-bold text-primary-500">W</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="text-lg font-bold text-gray-900 tabular-nums">
                          {game.awayscore}–{game.homescore}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center text-sm text-gray-500">
                        {game.season}
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            game.gametype === 'Playoff'
                              ? 'bg-primary-50 text-primary-600'
                              : 'bg-gray-50 text-gray-600'
                          }`}
                        >
                          {game.gametype}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <Link
                          href={`/games/${game.gameid}`}
                          className="text-sm font-semibold text-gray-900 hover:text-primary-500"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600 text-lg mb-2">No games found in the database.</p>
          <p className="text-gray-500 text-sm">
            Please add games to your database to see them here.
          </p>
        </div>
      )}

      {games.length > 0 && (
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">
              Total Games
            </h3>
            <p className="text-4xl font-black text-gray-900 tabular-nums">{games.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-primary-100 p-6 bg-primary-50/30">
            <h3 className="text-primary-600 text-xs font-bold uppercase tracking-wider mb-2">
              Playoff Games
            </h3>
            <p className="text-4xl font-black text-primary-600 tabular-nums">
              {games.filter((g) => g.gametype === 'Playoff').length}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">
              Regular Season
            </h3>
            <p className="text-4xl font-black text-gray-900 tabular-nums">
              {games.filter((g) => g.gametype === 'Regular').length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
