
'use client';

import { useMemo } from 'react';
import { useOrders, type ExpandedOrder } from '@/lib/hooks/use-orders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Summary, DrinkSummary } from '@/lib/types';

function calculateSummary(orders: ExpandedOrder[]): Summary {
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);
    const totalOrders = orders.length;

    const drinkStats = orders.flatMap(o => o.items).reduce((acc, item) => {
        if (!acc[item.name]) {
            acc[item.name] = { quantity: 0, revenue: 0 };
        }
        acc[item.name].quantity += item.quantity;
        acc[item.name].revenue += item.quantity * item.price;
        return acc;
    }, {} as Record<string, { quantity: number, revenue: number }>);

    const drinkSummaries: DrinkSummary[] = Object.entries(drinkStats).map(([name, stats]) => ({
        name,
        ...stats,
    })).sort((a, b) => b.quantity - a.quantity);


    const mostPopularDrink = drinkSummaries[0]?.name || 'N/A';

    return {
        totalRevenue,
        totalOrders,
        mostPopularDrink,
        drinkSummaries,
    };
}


export default function SummaryDisplay() {
  const { orders, isLoading, error } = useOrders();

  const summary = useMemo(() => {
    if (!orders) return { totalRevenue: 0, totalOrders: 0, mostPopularDrink: 'N/A', drinkSummaries: [] };
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
        const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
        return { status: 'pending', servedCount: 0, totalCount: totalItems };
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
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Drink Sales Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Drink</TableHead>
                                <TableHead className="text-right">Glasses Sold</TableHead>
                                <TableHead className="text-right">Total Revenue</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {summary.drinkSummaries.map(drink => (
                                <TableRow key={drink.name}>
                                    <TableCell className="font-medium">{drink.name}</TableCell>
                                    <TableCell className="text-right">{drink.quantity}</TableCell>
                                    <TableCell className="text-right">{drink.revenue.toFixed(2)} THB</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>All Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Time</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
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
                                        <TableCell>{order.customerName}</TableCell>
                                        <TableCell>
                                            <ul className="list-disc list-inside">
                                                {order.items.map((item, index) => (
                                                    <li key={index}>{item.quantity}x {item.name}</li>
                                                ))}
                                            </ul>
                                        </TableCell>
                                        <TableCell className="text-right">{order.totalAmount.toFixed(2)} THB</TableCell>
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
    </div>
  );
}
