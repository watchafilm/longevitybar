'use client';

import Link from 'next/link';
import Image from 'next/image';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-center">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="https://pic.onlinewebfonts.com/thumbnails/icons_285144.svg" alt="Longevity Bar Logo" width={24} height={24} className="h-6 w-6" />
          <span className="font-headline font-bold text-2xl bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            Longevity Bar
          </span>
        </Link>
      </div>
    </header>
  );
}
