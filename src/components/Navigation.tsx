'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';

export default function Navigation() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Home' },
    { href: '/teams', label: 'Teams' },
    { href: '/players', label: 'Players' },
    { href: '/games', label: 'Games' },
    { href: '/stats', label: 'Statistics' },
    { href: '/admin', label: 'Admin' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Disclosure as="nav" className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="text-2xl font-black tracking-tighter text-gray-900 hover:text-primary-500 transition-colors">
            NBA Stats<span className="text-primary-500">.</span>
          </Link>

          <div className="hidden md:flex gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium text-sm tracking-tight transition-colors ${
                  isActive(link.href)
                    ? 'text-primary-500 font-semibold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {mounted && (
            <DisclosureButton className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none">
              <span className="sr-only">Open main menu</span>
              <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </DisclosureButton>
          )}
        </div>
      </div>

      {mounted && (
        <DisclosurePanel className="md:hidden border-t border-gray-200">
          <div className="px-4 pt-2 pb-3 space-y-1 bg-white">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-primary-500 bg-primary-50 font-semibold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </DisclosurePanel>
      )}
    </Disclosure>
  );
}
