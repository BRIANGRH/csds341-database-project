import Link from 'next/link';
import { Card } from './Card';

interface GameCardProps {
  gameId: number;
  gameDate: Date;
  homeTeamName: string;
  awayTeamName: string;
  homeTeamCity: string;
  awayTeamCity: string;
  homeScore: number;
  awayScore: number;
  season: string;
  gameType: 'Regular' | 'Playoff';
}

export function GameCard({
  gameId,
  gameDate,
  homeTeamName,
  awayTeamName,
  homeTeamCity,
  awayTeamCity,
  homeScore,
  awayScore,
  season,
  gameType,
}: GameCardProps) {
  const awayWon = awayScore > homeScore;
  const homeWon = homeScore > awayScore;

  return (
    <Link href={`/games/${gameId}`}>
      <Card hover className="border border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <p className="font-semibold text-gray-800">
              {awayTeamCity} {awayTeamName}
            </p>
            <p className="text-sm text-gray-600">Away</p>
            {awayWon && <span className="text-success font-bold text-sm">W</span>}
          </div>
          <div className="text-center px-4">
            <p className="text-2xl font-bold text-gray-800">
              {awayScore} - {homeScore}
            </p>
            <p className="text-xs text-gray-500">{new Date(gameDate).toLocaleDateString()}</p>
          </div>
          <div className="flex-1 text-right">
            <p className="font-semibold text-gray-800">
              {homeTeamCity} {homeTeamName}
            </p>
            <p className="text-sm text-gray-600">Home</p>
            {homeWon && <span className="text-success font-bold text-sm">W</span>}
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-gray-500">{season}</span>
          <span
            className={`px-2 py-1 rounded font-semibold ${
              gameType === 'Playoff' ? 'bg-error/10 text-error' : 'bg-primary-100 text-primary-700'
            }`}
          >
            {gameType}
          </span>
        </div>
      </Card>
    </Link>
  );
}
