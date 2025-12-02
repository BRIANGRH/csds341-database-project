import Link from 'next/link';
import { Card } from './Card';

interface TeamCardProps {
  teamId: number;
  teamName: string;
  city: string;
  conference: 'East' | 'West';
  division: string;
  foundedYear: number;
}

export function TeamCard({ teamId, teamName, city, conference, division, foundedYear }: TeamCardProps) {
  const conferenceColor = conference === 'East' ? 'border-primary-500' : 'border-secondary-500';

  return (
    <Link href={`/teams/${teamId}`}>
      <Card hover className={`border-l-4 ${conferenceColor}`}>
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {city} {teamName}
        </h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p>
            <span className="font-semibold">Conference:</span> {conference}
          </p>
          <p>
            <span className="font-semibold">Division:</span> {division}
          </p>
          <p>
            <span className="font-semibold">Founded:</span> {foundedYear}
          </p>
        </div>
        <div className={`mt-4 ${conference === 'East' ? 'text-primary-600' : 'text-secondary-600'} font-semibold text-sm`}>
          View Team Details →
        </div>
      </Card>
    </Link>
  );
}
