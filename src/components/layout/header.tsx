'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function AppHeader() {
  const pathname = usePathname();
  const navLinks = [
    { href: '/', label: 'POS' },
    { href: '/kitchen', label: 'Kitchen' },
    { href: '/summary', label: 'Summary' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center space-x-2 mr-auto">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="https://drive.google.com/uc?export=view&id=1Pwf3RxSHPaugo7mvNVmngr4PZmSnUvOa" alt="Longevity Bar Logo" width={40} height={40} className="h-10 w-10" />
            <h1 className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text font-headline text-2xl md:text-3xl font-bold text-transparent">
              Longevity Bar
            </h1>
          </Link>
        </div>
        <nav>
          <ul className="flex items-center space-x-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>
                  <span className={cn(
                    "font-medium text-muted-foreground transition-colors hover:text-foreground",
                    pathname === link.href && "text-foreground"
                  )}>
                    {link.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
