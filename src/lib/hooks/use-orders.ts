
'use client';

import { useMemo } from 'react';
import { collection, query, orderBy, Timestamp } from 'firebase/firestore';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import type { Order, OrderItem } from '@/lib/types';

export interface ExpandedOrder extends Order {
  createdAt: number; 
  itemStatuses?: ('pending' | 'served')[];
  customerName: string;
}

const convertOrder = (orderData: any): ExpandedOrder => {
  return {
    ...orderData,
    id: orderData.id,
    createdAt: orderData.createdAt instanceof Timestamp ? orderData.createdAt.toMillis() : orderData.createdAt,
    items: orderData.items as OrderItem[],
    itemStatuses: orderData.itemStatuses || orderData.items.map(() => 'pending'),
  };
};

export const useOrders = () => {
  const { firestore } = useFirebase();

  const q = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
        collection(firestore, 'orders'),
        orderBy('createdAt', 'asc')
    );
  }, [firestore]);

  const { data, isLoading, error } = useCollection(q);

  const orders = useMemo(() => data?.map(convertOrder), [data]);

  return { orders, isLoading, error };
};
