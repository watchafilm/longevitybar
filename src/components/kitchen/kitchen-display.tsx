'use client';

import { useMemo, useState, useTransition } from 'react';
import { useOrders } from '@/lib/hooks/use-orders';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { updateOrderStatus } from '@/lib/actions';
import { formatDistanceToNow } from 'date-fns';
import { Loader2, Check, Coffee } from 'lucide-react';
import type { Order, OrderItem } from '@/lib/types';
import { cn } from '@/lib/utils';

type FlattenedOrderItem = OrderItem & {
  orderId: string;
  orderStatus: 'pending' | 'served';
  orderCreatedAt: Date;
};

function KitchenSkeleton() {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Drink</TableHead>
              <TableHead>Order Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-10 w-24 ml-auto" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default function KitchenDisplay() {
  const { orders, loading } = useOrders('pending');
  const [isPending, startTransition] = useTransition();
  const [servingOrderId, setServingOrderId] = useState<string | null>(null);

  const flattenedItems = useMemo(() => {
    const allItems: FlattenedOrderItem[] = [];
    orders.forEach((order: Order) => {
      order.items.forEach((item: OrderItem) => {
        // Handle items with quantity > 1 by creating a row for each one
        for (let i = 0; i < item.quantity; i++) {
          allItems.push({
            ...item,
            quantity: 1, // Each row represents a single drink
            orderId: order.id,
            orderStatus: order.status,
            orderCreatedAt: order.createdAt,
          });
        }
      });
    });
    // Sort by creation time
    return allItems.sort((a, b) => a.orderCreatedAt.getTime() - b.orderCreatedAt.getTime());
  }, [orders]);

  const handleServeOrder = (orderId: string) => {
    setServingOrderId(orderId);
    startTransition(async () => {
      // Note: This action marks the entire order as served.
      // For individual item status, the action and data model would need modification.
      await updateOrderStatus(orderId, 'served');
      setServingOrderId(null);
    });
  };

  if (loading) {
    return <KitchenSkeleton />;
  }

  if (flattenedItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 border-2 border-dashed rounded-lg">
        <Check className="h-16 w-16 text-green-500 mb-4" />
        <h2 className="font-headline text-2xl font-semibold">All Caught Up!</h2>
        <p className="text-muted-foreground">There are no pending orders.</p>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Drink</TableHead>
              <TableHead>Order Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flattenedItems.map((item, index) => (
              <TableRow key={`${item.orderId}-${item.drinkId}-${index}`}>
                <TableCell className="font-semibold">{item.name}</TableCell>
                <TableCell>
                  <div className="text-sm text-muted-foreground">
                    {formatDistanceToNow(item.orderCreatedAt, { addSuffix: true })}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={item.orderStatus === 'served' ? 'default' : 'secondary'} className={cn(item.orderStatus === 'served' ? 'bg-green-500/80 text-white' : 'bg-yellow-500/80 text-white')}>
                    {item.orderStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    onClick={() => handleServeOrder(item.orderId)}
                    disabled={isPending && servingOrderId === item.orderId}
                  >
                    {isPending && servingOrderId === item.orderId ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Coffee className="mr-2 h-4 w-4" />
                    )}
                    Serve Drink
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
