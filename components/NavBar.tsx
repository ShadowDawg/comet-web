'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavBar({ uid }: { uid: string }) {
  const pathname = usePathname();
  const pages = ['home', 'friends', 'love', 'you'];
  
  const currentPage = pathname === `comet/${uid}` ? 'home' : pathname.split('/').pop() || 'home';

  return (
    <nav className="flex justify-center space-x-4 my-4">
      {pages.map((page) => (
        <Link
          key={page}
          href={`/comet/${uid}${page === 'home' ? '' : `/${page}`}`}
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            currentPage === page
              ? 'bg-yellow-400 text-white'
              : 'text-yellow-400 hover:bg-yellow-100'
          }`}
        >
          {page.charAt(0).toUpperCase() + page.slice(1)}
        </Link>
      ))}
    </nav>
  );
}