'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Wallet, QrCode, CreditCard, Utensils, CheckCircle } from 'lucide-react';
import { useAllOrders } from '@/lib/hooks/use-orders';
import { Skeleton } from '../ui/skeleton';
import type { Order, PaymentMethod } from '@/lib/types';
import { cn } from '@/lib/utils';

const paymentMethodIcons: Record<PaymentMethod, React.ElementType> = {
  cash: Wallet,
  qr: QrCode,
  credit_card_qr: CreditCard,
};

export default function SummaryView() {
    const { orders, loading } = useAllOrders();

    const totalSales = useMemo(() => {
        return orders
          .filter(order => order.status === 'served')
          .reduce((sum, order) => sum + order.totalAmount, 0);
      }, [orders]);

    const servedCount = useMemo(() => {
        return orders.filter(order => order.status === 'served').length;
    }, [orders]);

    const pendingCount = useMemo(() => {
        return orders.filter(order => order.status === 'pending').length;
    }, [orders]);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                    <Card><CardContent className="p-6"><Skeleton className="h-24 w-full" /></CardContent></Card>
                    <Card><CardContent className="p-6"><Skeleton className="h-24 w-full" /></CardContent></Card>
                    <Card><CardContent className="p-6"><Skeleton className="h-24 w-full" /></CardContent></Card>
                </div>
                <Card>
                    <CardHeader><Skeleton className="h-8 w-1/4" /></CardHeader>
                    <CardContent>
                        <Skeleton className="h-12 w-full mb-2" />
                        <Skeleton className="h-12 w-full mb-2" />
                        <Skeleton className="h-12 w-full" />
                    </CardContent>
                </Card>
            </div>
        );
    }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <span className="text-muted-foreground">฿</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">{totalSales.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total revenue from served orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders Served</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">{servedCount}</div>
            <p className="text-xs text-muted-foreground">Total number of completed orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Orders currently in the kitchen</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order: Order) => {
                  const Icon = paymentMethodIcons[order.paymentMethod];
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.id.slice(0, 5)}...</TableCell>
                      <TableCell>
                        <Badge variant={order.status === 'served' ? 'default' : 'secondary'} className={cn(order.status === 'served' ? 'bg-green-500/80 text-white' : '')}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}</TableCell>
                      <TableCell>
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      </TableCell>
                      <TableCell className="text-right font-mono">{order.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>
                        {order.createdAt ? format(order.createdAt, 'PPpp') : 'N/A'}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
