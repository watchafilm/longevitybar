
import SummaryDisplay from '@/components/summary/summary-display';

export default function SummaryPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold font-headline mb-6">Order Summary</h1>
      <SummaryDisplay />
    </div>
  );
}
