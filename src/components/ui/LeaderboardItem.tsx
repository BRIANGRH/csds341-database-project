import Link from 'next/link';

interface LeaderboardItemProps {
  rank: number;
  playerId: number;
  firstName: string;
  lastName: string;
  teamName: string;
  value: number;
  label: string;
  variant?: 'primary' | 'secondary' | 'accent';
}

export function LeaderboardItem({
  rank,
  playerId,
  firstName,
  lastName,
  teamName,
  value,
  label,
  variant = 'primary',
}: LeaderboardItemProps) {
  const colors = {
    primary: 'text-primary-600',
    secondary: 'text-secondary-600',
    accent: 'text-accent-600',
  };

  const bgColors = {
    primary: 'bg-primary-50 hover:bg-primary-100',
    secondary: 'bg-secondary-50 hover:bg-secondary-100',
    accent: 'bg-accent-50 hover:bg-accent-100',
  };

  return (
    <div className={`flex items-center justify-between p-3 ${bgColors[variant]} rounded transition-colors`}>
      <div className="flex items-center gap-3">
        <span className="text-xl font-bold text-gray-400 w-6">{rank}</span>
        <div>
          <Link href={`/players/${playerId}`} className={`font-semibold ${colors[variant]} hover:underline`}>
            {firstName} {lastName}
          </Link>
          <p className="text-xs text-gray-600">{teamName}</p>
        </div>
      </div>
      <div className="text-right">
        <span className={`text-2xl font-bold ${colors[variant]}`}>{value.toFixed(1)}</span>
        <p className="text-xs text-gray-600">{label}</p>
      </div>
    </div>
  );
}
