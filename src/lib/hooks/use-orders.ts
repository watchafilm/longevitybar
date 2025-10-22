'use client';

import { useMemo } from 'react';
import { collection, query, orderBy, Timestamp } from 'firebase/firestore';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import type { Order, OrderItem } from '@/lib/types';

export interface ExpandedOrder extends Order {
  createdAt: number; 
  itemStatuses?: ('pending' | 'served')[];
}

const convertOrder = (doc: any): ExpandedOrder => {
  const data = doc.data() as any;
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : data.createdAt,
    items: data.items as OrderItem[],
    itemStatuses: data.itemStatuses || data.items.map(() => 'pending'),
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
