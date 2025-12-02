import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <div className="mb-12">
      <h1 className="text-5xl font-black tracking-tight text-gray-900 mb-2">{title}</h1>
      {subtitle && <p className="text-lg text-gray-500 mt-3">{subtitle}</p>}
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}

interface SectionTitleProps {
  children: ReactNode;
}

export function SectionTitle({ children }: SectionTitleProps) {
  return (
    <h2 className="text-3xl font-bold mb-8 text-gray-900 tracking-tight">
      {children}
    </h2>
  );
}
