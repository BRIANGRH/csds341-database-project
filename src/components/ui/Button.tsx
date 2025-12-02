import { ReactNode } from 'react';
import Link from 'next/link';

interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'soft';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Button({
  children,
  href,
  onClick,
  variant = 'soft',
  size = 'md',
  className = '',
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold shadow-xs transition-colors';

  const variants = {
    primary: 'rounded-md bg-primary-600 text-white hover:bg-primary-700',
    secondary: 'rounded-md bg-secondary-600 text-white hover:bg-secondary-700',
    soft: 'rounded-md bg-primary-50 text-primary-600 hover:bg-primary-100',
  };

  const sizes = {
    xs: 'rounded-sm px-2 py-1 text-xs',
    sm: 'rounded-sm px-2 py-1 text-sm',
    md: 'rounded-md px-2.5 py-1.5 text-sm',
    lg: 'rounded-md px-3 py-2 text-sm',
    xl: 'rounded-md px-3.5 py-2.5 text-sm',
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
