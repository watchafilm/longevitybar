'use client';

import Link from 'next/link';
import Image from 'next/image';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-center">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="https://pic.onlinewebfonts.com/thumbnails/icons_285144.svg" alt="Longevity Bar Logo" width={40} height={40} className="h-10 w-10 filter invert-[.25] sepia-[1] saturate-[5] hue-rotate-[20deg]" />
          <h1 className="font-headline font-bold text-4xl text-yellow-500">
            Longevity Bar
          </h1>
        </Link>
      </div>
    </header>
  );
}
