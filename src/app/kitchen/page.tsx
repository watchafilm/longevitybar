import KitchenDisplay from '@/components/kitchen/kitchen-display';

export default function KitchenPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-headline text-4xl font-bold">Kitchen Orders</h1>
        <p className="text-muted-foreground">Real-time display of incoming drink orders.</p>
      </div>
      <KitchenDisplay />
    </div>
  );
}
