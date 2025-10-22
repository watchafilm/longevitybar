'use server';

import { revalidatePath } from 'next/cache';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { OrderPayload } from '@/lib/types';

export async function createOrder(orderData: OrderPayload) {
  try {
    await addDoc(collection(db, 'orders'), {
      ...orderData,
      status: 'pending',
      createdAt: serverTimestamp(),
    });
    revalidatePath('/kitchen');
    revalidatePath('/summary');
    return { success: true, message: 'Order created successfully.' };
  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, message: 'Failed to create order.' };
  }
}

export async function updateOrderStatus(orderId: string, status: 'pending' | 'served') {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { status });
    revalidatePath('/kitchen');
    revalidatePath('/summary');
    return { success: true, message: 'Order status updated.' };
  } catch (error) {
    console.error('Error updating order status:', error);
    return { success: false, message: 'Failed to update order status.' };
  }
}
