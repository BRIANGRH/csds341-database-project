import Link from 'next/link';
import {
  getPointsLeaders,
  getReboundsLeaders,
  getAssistsLeaders,
  getTeamStandings,
  getAvailableSeasons,
} from '@/lib/queries';
import { StatsTabs } from '@/components/ui/StatsTabs';

export default async function StatsPage() {
  const seasons = await getAvailableSeasons();
  const currentSeason = seasons[0] || '2024-25';

  const [pointsLeaders, reboundsLeaders, assistsLeaders, eastStandings, westStandings] =
    await Promise.all([
      getPointsLeaders(currentSeason, 10),
      getReboundsLeaders(currentSeason, 10),
      getAssistsLeaders(currentSeason, 10),
      getTeamStandings(currentSeason, 'East'),
      getTeamStandings(currentSeason, 'West'),
    ]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-5xl font-black tracking-tight text-gray-900">Statistics</h1>
        <p className="text-lg text-gray-500 mt-3">{currentSeason} season leaders</p>
      </div>

      <StatsTabs
        pointsLeaders={pointsLeaders}
        reboundsLeaders={reboundsLeaders}
        assistsLeaders={assistsLeaders}
      />

      <h2 className="text-3xl font-bold mb-6 text-gray-900 tracking-tight">
        Standings <span className="text-primary-500">•</span> {currentSeason}
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Eastern Conference</h3>
          </div>
          <div className="overflow-x-auto">
            {eastStandings.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Team</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">W</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">L</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Win%</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">PPG</th>
                  </tr>
                </thead>
                <tbody>
                  {eastStandings.map((team, index) => (
                    <tr key={team.teamid} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className={`px-4 py-4 text-sm font-bold ${
                        index === 0 ? 'text-primary-500' : 'text-gray-400'
                      }`}>{index + 1}</td>
                      <td className="px-4 py-4">
                        <Link
                          href={`/teams/${team.teamid}`}
                          className="text-sm font-semibold text-gray-900 hover:text-primary-500"
                        >
                          {team.city} {team.teamname}
                        </Link>
                      </td>
                      <td className="px-4 py-4 text-center text-sm font-bold text-gray-900 tabular-nums">
                        {team.wins}
                      </td>
                      <td className="px-4 py-4 text-center text-sm font-bold text-gray-400 tabular-nums">
                        {team.losses}
                      </td>
                      <td className="px-4 py-4 text-center text-sm font-bold text-gray-900 tabular-nums">
                        {Number(team.winpercentage).toFixed(3)}
                      </td>
                      <td className="px-4 py-4 text-center text-sm text-gray-500 tabular-nums">
                        {Number(team.pointspergame).toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="px-6 py-4 text-gray-600 text-center">No standings data available</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Western Conference</h3>
          </div>
          <div className="overflow-x-auto">
            {westStandings.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Team</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">W</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">L</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Win%</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">PPG</th>
                  </tr>
                </thead>
                <tbody>
                  {westStandings.map((team, index) => (
                    <tr key={team.teamid} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className={`px-4 py-4 text-sm font-bold ${
                        index === 0 ? 'text-primary-500' : 'text-gray-400'
                      }`}>{index + 1}</td>
                      <td className="px-4 py-4">
                        <Link
                          href={`/teams/${team.teamid}`}
                          className="text-sm font-semibold text-gray-900 hover:text-primary-500"
                        >
                          {team.city} {team.teamname}
                        </Link>
                      </td>
                      <td className="px-4 py-4 text-center text-sm font-bold text-gray-900 tabular-nums">
                        {team.wins}
                      </td>
                      <td className="px-4 py-4 text-center text-sm font-bold text-gray-400 tabular-nums">
                        {team.losses}
                      </td>
                      <td className="px-4 py-4 text-center text-sm font-bold text-gray-900 tabular-nums">
                        {Number(team.winpercentage).toFixed(3)}
                      </td>
                      <td className="px-4 py-4 text-center text-sm text-gray-500 tabular-nums">
                        {Number(team.pointspergame).toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="px-6 py-4 text-gray-600 text-center">No standings data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}