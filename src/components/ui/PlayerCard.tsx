import Link from 'next/link';
import { Card } from './Card';

interface PlayerCardProps {
  playerId: number;
  firstName: string;
  lastName: string;
  position: string;
  height: number;
  weight: number;
  teamName?: string;
  teamCity?: string;
}

export function PlayerCard({
  playerId,
  firstName,
  lastName,
  position,
  height,
  weight,
  teamName,
  teamCity,
}: PlayerCardProps) {
  return (
    <Link href={`/players/${playerId}`}>
      <Card hover className="border-l-4 border-primary-500">
        <h3 className="text-lg font-bold text-gray-800 mb-2">
          {firstName} {lastName}
        </h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p>
            <span className="font-semibold">Position:</span> {position}
          </p>
          <p>
            <span className="font-semibold">Height:</span> {Math.floor(height / 12)}'{height % 12}"
          </p>
          <p>
            <span className="font-semibold">Weight:</span> {weight} lbs
          </p>
          {teamName ? (
            <p className="text-primary-600 font-semibold">
              {teamCity} {teamName}
            </p>
          ) : (
            <p className="text-gray-400 italic">Free Agent</p>
          )}
        </div>
      </Card>
    </Link>
  );
}
