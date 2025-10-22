'use client';

import { useMemo } from 'react';
import { collection, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { useFirestore, useMemoFirebase, useCollection, useUser } from '@/firebase';
import type { Order, OrderStatus } from '@/lib/types';


export function useOrders(status: OrderStatus) {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  const ordersQuery = useMemoFirebase(() => {
    // Wait for user and firestore to be available
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'orders'),
      where('status', '==', status),
      orderBy('createdAt', 'asc')
    );
  }, [firestore, user, status]);

  const { data: ordersData, isLoading: loading } = useCollection<Order>(ordersQuery);

  const orders = useMemo(() => {
    if (!ordersData) return [];
    return ordersData.map(order => ({
      ...order,
      createdAt: (order.createdAt as Timestamp)?.toDate() || new Date()
    }));
  }, [ordersData]);


  return { orders, loading: isUserLoading || loading };
}

export function useAllOrders() {
    const firestore = useFirestore();
    const { user, isUserLoading } = useUser();
  
    const allOrdersQuery = useMemoFirebase(() => {
        // Wait for user and firestore to be available
        if (!firestore || !user) return null;
        return query(
            collection(firestore, 'orders'),
            orderBy('createdAt', 'desc')
        );
    }, [firestore, user]);

    const { data: ordersData, isLoading: loading } = useCollection<Order>(allOrdersQuery);
    
    const orders = useMemo(() => {
      if (!ordersData) return [];
      return ordersData.map(order => ({
        ...order,
        createdAt: (order.createdAt as Timestamp)?.toDate() || new Date()
      }));
    }, [ordersData]);
  
    return { orders, loading: isUserLoading || loading };
  }
