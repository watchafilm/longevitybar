import SummaryView from '@/components/summary/summary-view';
import { Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const revalidate = 0; // Revalidate on every request

export default function SummaryPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-headline text-4xl font-bold">Order Summary</h1>
        <p className="text-muted-foreground">View order history and sales totals.</p>
      </div>
      <Suspense fallback={
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-8 w-1/4 mb-2" />
              <Skeleton className="h-12 w-1/2" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-10 w-full mb-4" />
              <Skeleton className="h-10 w-full mb-2" />
              <Skeleton className="h-10 w-full mb-2" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      }>
        <SummaryView />
      </Suspense>
    </div>
  );
}
