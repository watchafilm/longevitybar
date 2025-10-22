'use client';

import Link from 'next/link';
import Image from 'next/image';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-center">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="https://drive.google.com/uc?export=view&id=1Pwf3RxSHPaugo7mvNVmngr4PZmSnUvOa" alt="Longevity Bar Logo" width={40} height={40} className="h-10 w-10" />
          <h1 className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text font-headline text-4xl font-bold text-transparent">
            Longevity Bar
          </h1>
        </Link>
      </div>
    </header>
  );
}
