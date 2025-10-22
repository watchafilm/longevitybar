'use client';

import { useTransition } from 'react';
import { useOrders, type ExpandedOrder } from '@/lib/hooks/use-orders';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { updateOrderStatus } from '@/lib/actions';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function KitchenDisplay() {
  const { orders, isLoading, error } = useOrders();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleServe = (orderId: string, itemIndex: number, newStatus: 'served') => {
    startTransition(async () => {
      try {
        const result = await updateOrderStatus(orderId, itemIndex, newStatus);
        if (result?.success) {
          toast({
            title: 'Status Updated',
            description: `Order item has been marked as served.`,
          });
        } else {
          throw new Error(result?.message || 'Failed to update status.');
        }
      } catch (e: any) {
        toast({
          variant: 'destructive',
          title: 'Update Failed',
          description: e.message || 'Could not update order status.',
        });
      }
    });
  };

  const renderOrderRow = (item: ExpandedOrder, itemIndex: number) => {
    const itemStatus = item.itemStatuses?.[itemIndex] || 'pending';

    return (
      <TableRow key={`${item.id}-${itemIndex}`}>
        <TableCell>{new Date(item.createdAt).toLocaleTimeString()}</TableCell>
        <TableCell className="font-medium">{item.items[itemIndex].name}</TableCell>
        <TableCell>{item.items[itemIndex].quantity}</TableCell>
        <TableCell>
          <Badge variant={itemStatus === 'served' ? 'secondary' : 'default'}>{itemStatus}</Badge>
        </TableCell>
        <TableCell>
          <Button
            size="sm"
            onClick={() => handleServe(item.id, itemIndex, 'served')}
            disabled={isPending || itemStatus === 'served'}
          >
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Serve
          </Button>
        </TableCell>
      </TableRow>
    );
  };

  if (isLoading) {
    return <div>Loading orders...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading orders: {error.message}</div>;
  }

  const flattenedOrders = orders?.flatMap(order =>
    order.items.map((_, itemIndex) => renderOrderRow(order, itemIndex))
  );

  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Drink</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{flattenedOrders && flattenedOrders.length > 0 ? flattenedOrders : <TableRow><TableCell colSpan={5} className="text-center">No pending orders.</TableCell></TableRow>}</TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
