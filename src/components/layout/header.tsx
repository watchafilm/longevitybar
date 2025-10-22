
'use client';

import Link from 'next/link';
import Image from 'next/image';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-center">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="https://pic.onlinewebfonts.com/thumbnails/icons_285144.svg" alt="Longevity Bar Logo" width={40} height={40} className="h-10 w-10 filter invert-[.25] sepia-[1] saturate-[5] hue-rotate-[20deg]" />
          <h1 className="font-headline font-bold text-4xl">
            <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-transparent bg-clip-text">Lo</span>
            <span className="bg-gradient-to-r from-indigo-500 to-blue-500 text-transparent bg-clip-text">ng</span>
            <span className="bg-gradient-to-r from-blue-500 to-green-500 text-transparent bg-clip-text">ev</span>
            <span className="bg-gradient-to-r from-green-500 to-yellow-500 text-transparent bg-clip-text">ity</span>
            <span> </span>
            <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-transparent bg-clip-text">Ba</span>
            <span className="bg-gradient-to-r from-orange-500 to-red-500 text-transparent bg-clip-text">r</span>
          </h1>
        </Link>
      </div>
    </header>
  );
}
