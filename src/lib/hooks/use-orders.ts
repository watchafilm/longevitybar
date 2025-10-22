'use client';

import { useState, useEffect, useMemo } from 'react';
import { collection, query, where, onSnapshot, orderBy, Query, CollectionReference, DocumentData } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase';
import type { Order, OrderStatus } from '@/lib/types';


export function useOrders(status: OrderStatus) {
  const firestore = useFirestore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const ordersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'orders'),
      where('status', '==', status),
      orderBy('createdAt', 'asc')
    );
  }, [firestore, status]);

  useEffect(() => {
    if (!ordersQuery) {
        setLoading(false);
        return;
    }
    setLoading(true);
    const unsubscribe = onSnapshot(ordersQuery, (querySnapshot) => {
      const ordersData: Order[] = [];
      querySnapshot.forEach((doc) => {
        ordersData.push({ id: doc.id, ...doc.data() } as Order);
      });
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching orders: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [ordersQuery]);

  return { orders, loading };
}

export function useAllOrders() {
    const firestore = useFirestore();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
  
    const allOrdersQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(
            collection(firestore, 'orders'),
            orderBy('createdAt', 'desc')
        );
    }, [firestore]);

    useEffect(() => {
        if(!allOrdersQuery) {
            setLoading(false);
            return;
        }
      const unsubscribe = onSnapshot(allOrdersQuery, (querySnapshot) => {
        const ordersData: Order[] = [];
        querySnapshot.forEach((doc) => {
          ordersData.push({ id: doc.id, ...doc.data() } as Order);
        });
        setOrders(ordersData);
        setLoading(false);
      }, (error) => {
        console.error("Error fetching all orders: ", error);
        setLoading(false);
      });
  
      return () => unsubscribe();
    }, [allOrdersQuery]);
  
    return { orders, loading };
  }
