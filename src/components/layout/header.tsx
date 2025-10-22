'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export function AppHeader() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="https://drive.google.com/uc?export=view&id=1XCn1KoGz8N98K-W073bsMgX80lfHy3H8" alt="Longevity Bar Logo" width={40} height={40} className="h-10 w-10" />
            <h1 className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text font-headline text-2xl md:text-3xl font-bold text-transparent">
              Longevity Bar
            </h1>
          </Link>
        </div>
      </div>
    </header>
  );
}
