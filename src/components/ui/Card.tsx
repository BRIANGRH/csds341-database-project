import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={`overflow-hidden rounded-xl bg-white border border-gray-100 ${
        hover ? 'card-hover' : ''
      } ${className}`}
    >
      <div className="px-6 py-6 sm:p-8">{children}</div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'error';
}

export function StatCard({ title, value, subtitle, icon, variant = 'default' }: StatCardProps) {
  const borderColors = {
    default: 'border-gray-300',
    primary: 'border-primary-500',
    success: 'border-success',
    error: 'border-error',
  };

  const valueColors = {
    default: 'text-gray-800',
    primary: 'text-primary-600',
    success: 'text-success',
    error: 'text-error',
  };

  return (
    <Card className={`border-l-4 ${borderColors[variant]}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-gray-600 text-sm font-semibold uppercase">{title}</h3>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <p className={`text-4xl font-bold ${valueColors[variant]}`}>{value}</p>
      {subtitle && <p className="text-sm text-gray-600 mt-2">{subtitle}</p>}
    </Card>
  );
}
