'use server';

import { revalidatePath } from 'next/cache';
import { collection, doc, serverTimestamp, getFirestore } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { OrderPayload } from '@/lib/types';
import { addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';

export async function createOrder(orderData: OrderPayload) {
  try {
    const ordersCollection = collection(db, 'orders');
    await addDocumentNonBlocking(ordersCollection, {
      ...orderData,
      status: 'pending',
      createdAt: serverTimestamp(),
    });

    revalidatePath('/kitchen');
    revalidatePath('/summary');
    
    return { success: true, message: 'Order created successfully.' };
  } catch (error) {
    console.error('Error in createOrder action:', error);
    return { success: false, message: (error as Error).message || 'Failed to create order.' };
  }
}

export async function updateOrderStatus(orderId: string, status: 'pending' | 'served') {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDocumentNonBlocking(orderRef, { status });

    revalidatePath('/kitchen');
    revalidatePath('/summary');

    return { success: true, message: 'Order status updated.' };
  } catch (error) {
    console.error('Error in updateOrderStatus action:', error);
    return { success: false, message: (error as Error).message || 'Failed to update order status.' };
  }
}
