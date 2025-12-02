import Link from 'next/link';
import {
  getPlayerById,
  getPlayerAllSeasonStats,
  getPlayerGameStats,
  getPlayerTransactions,
} from '@/lib/queries';
import { notFound } from 'next/navigation';

interface PlayerPageProps {
  params: Promise<{ id: string }>;
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { id } = await params;
  const playerId = parseInt(id);

  if (isNaN(playerId)) {
    notFound();
  }

  const [player, seasonStats, recentGames, transactions] = await Promise.all([
    getPlayerById(playerId),
    getPlayerAllSeasonStats(playerId),
    getPlayerGameStats(playerId, 10),
    getPlayerTransactions(playerId),
  ]);

  if (!player) {
    notFound();
  }

  const age = player.dateofbirth
    ? Math.floor((new Date().getTime() - new Date(player.dateofbirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm p-8 mb-8 border-b border-gray-200">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          {player.firstname} {player.lastname}
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-lg">
          <div>
            <p className="text-gray-600 text-sm">Position</p>
            <p className="font-bold text-gray-900">{player.position}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Height</p>
            <p className="font-bold text-gray-900">
              {Math.floor(player.height / 12)}'{player.height % 12}"
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Weight</p>
            <p className="font-bold text-gray-900">{player.weight} lbs</p>
          </div>
          {age && (
            <div>
              <p className="text-gray-600 text-sm">Age</p>
              <p className="font-bold text-gray-900">{age}</p>
            </div>
          )}
          <div>
            <p className="text-gray-600 text-sm">Draft Year</p>
            <p className="font-bold text-gray-900">{player.draftyear || 'Undrafted'}</p>
          </div>
        </div>
        {player.teamname && (
          <div className="mt-4">
            <Link
              href={`/teams/${player.currentteamid}`}
              className="inline-block bg-gray-900 text-white px-4 py-2 rounded font-semibold hover:bg-gray-800 transition-colors"
            >
              {player.teamcity} {player.teamname} →
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Career Statistics</h2>
            {seasonStats.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-3 py-2 text-left">Season</th>
                      <th className="px-3 py-2 text-center">GP</th>
                      <th className="px-3 py-2 text-center">PPG</th>
                      <th className="px-3 py-2 text-center">RPG</th>
                      <th className="px-3 py-2 text-center">APG</th>
                      <th className="px-3 py-2 text-center">FG%</th>
                      <th className="px-3 py-2 text-center">3P%</th>
                      <th className="px-3 py-2 text-center">FT%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {seasonStats.map((stats) => (
                      <tr key={stats.season} className="border-b hover:bg-gray-50">
                        <td className="px-3 py-3 font-semibold">{stats.season}</td>
                        <td className="px-3 py-3 text-center">{stats.gamesplayed}</td>
                        <td className="px-3 py-3 text-center font-semibold text-gray-900">
                          {Number(stats.avgpoints).toFixed(1)}
                        </td>
                        <td className="px-3 py-3 text-center">{Number(stats.avgrebounds).toFixed(1)}</td>
                        <td className="px-3 py-3 text-center">{Number(stats.avgassists).toFixed(1)}</td>
                        <td className="px-3 py-3 text-center">
                          {(Number(stats.fieldgoalpercentage) * 100).toFixed(1)}%
                        </td>
                        <td className="px-3 py-3 text-center">
                          {(Number(stats.threepointpercentage) * 100).toFixed(1)}%
                        </td>
                        <td className="px-3 py-3 text-center">
                          {(Number(stats.freethrowpercentage) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600">No season statistics available for this player.</p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Recent Game Log</h2>
            {recentGames.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-3 py-2 text-left">Game</th>
                      <th className="px-3 py-2 text-center">MIN</th>
                      <th className="px-3 py-2 text-center">PTS</th>
                      <th className="px-3 py-2 text-center">REB</th>
                      <th className="px-3 py-2 text-center">AST</th>
                      <th className="px-3 py-2 text-center">STL</th>
                      <th className="px-3 py-2 text-center">BLK</th>
                      <th className="px-3 py-2 text-center">FG</th>
                      <th className="px-3 py-2 text-center">3PT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentGames.map((game) => (
                      <tr key={game.statid} className="border-b hover:bg-gray-50">
                        <td className="px-3 py-3">
                          <Link
                            href={`/games/${game.gameid}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Game #{game.gameid}
                          </Link>
                        </td>
                        <td className="px-3 py-3 text-center">{game.minutesplayed}</td>
                        <td className="px-3 py-3 text-center font-semibold text-blue-600">
                          {game.points}
                        </td>
                        <td className="px-3 py-3 text-center">{game.rebounds}</td>
                        <td className="px-3 py-3 text-center">{game.assists}</td>
                        <td className="px-3 py-3 text-center">{game.steals}</td>
                        <td className="px-3 py-3 text-center">{game.blocks}</td>
                        <td className="px-3 py-3 text-center text-xs">
                          {game.fieldgoalsmade}/{game.fieldgoalsattempted}
                        </td>
                        <td className="px-3 py-3 text-center text-xs">
                          {game.threepointersmade}/{game.threepointersattempted}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600">No recent games available for this player.</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Player Info</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600">Full Name</p>
                <p className="font-semibold">
                  {player.firstname} {player.lastname}
                </p>
              </div>
              {player.dateofbirth && (
                <div>
                  <p className="text-gray-600">Date of Birth</p>
                  <p className="font-semibold">
                    {new Date(player.dateofbirth).toLocaleDateString()}
                  </p>
                </div>
              )}
              <div>
                <p className="text-gray-600">Position</p>
                <p className="font-semibold">{player.position}</p>
              </div>
              <div>
                <p className="text-gray-600">Height / Weight</p>
                <p className="font-semibold">
                  {Math.floor(player.height / 12)}'{player.height % 12}" / {player.weight} lbs
                </p>
              </div>
              {player.draftyear && (
                <div>
                  <p className="text-gray-600">Draft Year</p>
                  <p className="font-semibold">{player.draftyear}</p>
                </div>
              )}
            </div>
          </div>

          {transactions.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-900">Transaction History</h3>
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.transactionid}
                    className="border-l-4 border-gray-300 pl-3 py-2"
                  >
                    <p className="font-semibold text-sm">{transaction.transactiontype}</p>
                    <p className="text-xs text-gray-600">
                      {new Date(transaction.transactiondate).toLocaleDateString()}
                    </p>
                    {transaction.contractvalue && (
                      <p className="text-xs text-green-600 font-semibold">
                        ${(transaction.contractvalue / 1000000).toFixed(1)}M
                      </p>
                    )}
                    {transaction.notes && (
                      <p className="text-xs text-gray-500 mt-1">{transaction.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
