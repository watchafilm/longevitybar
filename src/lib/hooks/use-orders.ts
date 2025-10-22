'use client';

import { useMemo } from 'react';
import { collection, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import type { Order, OrderStatus } from '@/lib/types';


export function useOrders(status: OrderStatus) {
  const firestore = useFirestore();

  const ordersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'orders'),
      where('status', '==', status),
      orderBy('createdAt', 'asc')
    );
  }, [firestore, status]);

  const { data: ordersData, isLoading: loading } = useCollection<Order>(ordersQuery);

  const orders = useMemo(() => {
    if (!ordersData) return [];
    return ordersData.map(order => ({
      ...order,
      // Safely convert Firestore Timestamp to JS Date
      createdAt: order.createdAt instanceof Timestamp ? order.createdAt.toDate() : new Date()
    }));
  }, [ordersData]);


  return { orders, loading };
}

export function useAllOrders() {
    const firestore = useFirestore();
  
    const allOrdersQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(
            collection(firestore, 'orders'),
            orderBy('createdAt', 'desc')
        );
    }, [firestore]);

    const { data: ordersData, isLoading: loading } = useCollection<Order>(allOrdersQuery);
    
    const orders = useMemo(() => {
      if (!ordersData) return [];
      return ordersData.map(order => ({
        ...order,
        // Safely convert Firestore Timestamp to JS Date
        createdAt: order.createdAt instanceof Timestamp ? order.createdAt.toDate() : new Date()
      }));
    }, [ordersData]);
  
    return { orders, loading };
  }
