import KitchenDisplay from '@/components/kitchen/kitchen-display';

export default function KitchenPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold font-headline mb-6">Kitchen Orders</h1>
      <KitchenDisplay />
    </div>
  );
}
