'use client';

import Link from 'next/link';
import Image from 'next/image';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-center">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="https://pic.onlinewebfonts.com/thumbnails/icons_285144.svg" alt="Longevity Bar Logo" width={32} height={32} className="h-8 w-8 filter invert-[.25] sepia-[1] saturate-[5] hue-rotate-[40deg]" />
          <h1 className="font-headline font-bold text-3xl">
            <span className="bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">Lo</span>
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text">ng</span>
            <span className="bg-gradient-to-r from-green-400 to-green-600 text-transparent bg-clip-text">ev</span>
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-transparent bg-clip-text">ity</span>
            <span> </span>
            <span className="bg-gradient-to-r from-orange-400 to-orange-600 text-transparent bg-clip-text">Ba</span>
            <span className="bg-gradient-to-r from-red-400 to-red-600 text-transparent bg-clip-text">r</span>
          </h1>
        </Link>
      </div>
    </header>
  );
}
