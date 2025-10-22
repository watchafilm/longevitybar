
'use client';

import { useMemo } from 'react';
import { useOrders, type ExpandedOrder } from '@/lib/hooks/use-orders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Summary } from '@/lib/types';

function calculateSummary(orders: ExpandedOrder[]): Summary {
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);
    const totalOrders = orders.length;
    
    const drinkCounts = orders.flatMap(o => o.items).reduce((acc, item) => {
        acc[item.name] = (acc[item.name] || 0) + item.quantity;
        return acc;
    }, {} as Record<string, number>);

    const mostPopularDrink = Object.entries(drinkCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    return {
        totalRevenue,
        totalOrders,
        mostPopularDrink,
    };
}


export default function SummaryDisplay() {
  const { orders, isLoading, error } = useOrders();

  const summary = useMemo(() => {
    if (!orders) return { totalRevenue: 0, totalOrders: 0, mostPopularDrink: 'N/A' };
    return calculateSummary(orders);
  }, [orders]);

  if (isLoading) {
    return <div>Loading summary...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading summary: {error.message}</div>;
  }
  
  const getOrderStatus = (order: ExpandedOrder): { status: 'pending' | 'in progress' | 'served', servedCount: number, totalCount: number } => {
    if (!order.itemStatuses || order.itemStatuses.length === 0) {
        return { status: 'pending', servedCount: 0, totalCount: order.items.length };
    }
    const servedCount = order.itemStatuses.filter(s => s === 'served').length;
    const totalCount = order.items.length;

    if (servedCount === totalCount) {
        return { status: 'served', servedCount, totalCount };
    }
    if (servedCount > 0) {
        return { status: 'in progress', servedCount, totalCount };
    }
    return { status: 'pending', servedCount, totalCount };
  }

  return (
    <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{summary.totalRevenue.toFixed(2)} THB</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{summary.totalOrders}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Most Popular Drink</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{summary.mostPopularDrink}</div>
                </CardContent>
            </Card>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>All Orders</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders && orders.length > 0 ? (
                        orders.sort((a, b) => b.createdAt - a.createdAt).map(order => {
                           const { status, servedCount, totalCount } = getOrderStatus(order);
                           return (
                                <TableRow key={order.id}>
                                    <TableCell>{new Date(order.createdAt).toLocaleTimeString()}</TableCell>
                                    <TableCell>
                                        <ul className="list-disc list-inside">
                                            {order.items.map((item, index) => (
                                                <li key={index}>{item.quantity}x {item.name}</li>
                                            ))}
                                        </ul>
                                    </TableCell>
                                    <TableCell>{order.totalAmount.toFixed(2)} THB</TableCell>
                                    <TableCell>{order.paymentMethod}</TableCell>
                                    <TableCell>
                                        <Badge variant={status === 'served' ? 'secondary' : (status === 'in progress' ? 'default' : 'outline')}>
                                            {status} ({servedCount}/{totalCount})
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                           );
                        })
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center">No orders found.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
}
