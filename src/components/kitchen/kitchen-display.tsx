'use client';

import { useOrders } from '@/lib/hooks/use-orders';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { updateOrderStatus } from '@/lib/actions';
import { formatDistanceToNow } from 'date-fns';
import { useTransition } from 'react';
import { Loader2, Check } from 'lucide-react';

function OrderCardSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <div className="flex justify-between">
                        <Skeleton className="h-5 w-1/3" />
                        <Skeleton className="h-5 w-1/4" />
                    </div>
                    <div className="flex justify-between">
                        <Skeleton className="h-5 w-1/3" />
                        <Skeleton className="h-5 w-1/4" />
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Skeleton className="h-10 w-full" />
            </CardFooter>
        </Card>
    );
}


export default function KitchenDisplay() {
  const { orders, loading } = useOrders('pending');
  const [isPending, startTransition] = useTransition();
  const [servingOrderId, setServingOrderId] = useState<string | null>(null);

  const handleServeOrder = (orderId: string) => {
    setServingOrderId(orderId);
    startTransition(async () => {
      await updateOrderStatus(orderId, 'served');
      setServingOrderId(null);
    });
  }

  if (loading) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <OrderCardSkeleton />
            <OrderCardSkeleton />
            <OrderCardSkeleton />
            <OrderCardSkeleton />
        </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 border-2 border-dashed rounded-lg">
        <Check className="h-16 w-16 text-green-500 mb-4" />
        <h2 className="font-headline text-2xl font-semibold">All Caught Up!</h2>
        <p className="text-muted-foreground">There are no pending orders.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {orders.map((order) => (
        <Card key={order.id} className="flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline">Order #{order.id.slice(0, 5)}</CardTitle>
            <CardDescription>
              {order.createdAt ? `${formatDistanceToNow(order.createdAt.toDate())} ago` : 'Just now'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <Separator className="mb-4" />
            <ul className="space-y-2">
              {order.items.map((item) => (
                <li key={item.name} className="flex justify-between items-center">
                  <span className="font-semibold">{item.name}</span>
                  <span className="font-bold text-primary">x {item.quantity}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
                className="w-full" 
                onClick={() => handleServeOrder(order.id)}
                disabled={isPending}
            >
              {isPending && servingOrderId === order.id ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-2 h-4 w-4" />
              )}
              Serve
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

// Stub useState to avoid React errors in server components
const useState = (initialState: any) => [initialState, () => {}];
