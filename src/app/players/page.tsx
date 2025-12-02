import { getAllPlayers } from '@/lib/queries';
import { PlayersFilter } from '@/components/ui/PlayersFilter';

export default async function PlayersPage() {
  const players = await getAllPlayers();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">NBA Players</h1>
        <p className="text-gray-600">Browse all players in the database</p>
      </div>

      {players.length > 0 ? (
        <PlayersFilter players={players} />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No players found in the database.</p>
          <p className="text-gray-500 text-sm mt-2">
            Please add players to your database to see them here.
          </p>
        </div>
      )}
    </div>
  );
}
