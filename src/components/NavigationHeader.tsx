'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavigationHeader() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-dark-900/50 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="text-2xl font-bold text-white tracking-tight group-hover:text-primary-400 transition-colors duration-300">
              Scout<span className="text-primary-500">IQ</span>
            </span>
          </Link>

          <nav className="flex space-x-2">
            {[
              { name: 'Generate Report', path: '/' },
              { name: 'Compare Teams', path: '/comparison' },
              { name: 'Scouting Report', path: '/report' },
              { name: 'Methodology', path: '/methodology' },
            { name: 'Teams', path: '/teams' },
            ].map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${pathname === item.path
                    ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20 shadow-[0_0_10px_rgba(14,165,233,0.1)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}