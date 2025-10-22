'use client';

import Link from 'next/link';
import Image from 'next/image';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-center">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="https://pic.onlinewebfonts.com/thumbnails/icons_285144.svg" alt="Longevity Bar Logo" width={24} height={24} className="h-6 w-6" />
          <h1 className="font-headline font-bold text-2xl">
            <span className="text-purple-500">Lo</span>
            <span className="text-blue-500">ng</span>
            <span className="text-green-500">ev</span>
            <span className="text-yellow-500">ity</span>
            <span> </span>
            <span className="text-orange-500">Ba</span>
            <span className="text-red-500">r</span>
          </h1>
        </Link>
      </div>
    </header>
  );
}
