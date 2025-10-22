'use server';

import { revalidatePath } from 'next/cache';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { getSdks } from '@/firebase';
import type { OrderPayload } from '@/lib/types';
import { initializeFirebase } from '@/firebase';

async function getFirestoreInstance() {
    const { firestore } = initializeFirebase();
    return firestore;
}

export async function createOrder(orderData: OrderPayload) {
  try {
    const db = await getFirestoreInstance();
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
    // In a real app, you might want to return a more specific error message
    // and handle it with the FirestorePermissionError architecture.
    return { success: false, message: 'Failed to create order.' };
  }
}

export async function updateOrderStatus(orderId: string, status: 'pending' | 'served') {
  try {
    const db = await getFirestoreInstance();
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { status });
    revalidatePath('/kitchen');
    revalidatePath('/summary');
    return { success: true, message: 'Order status updated.' };
  } catch (error) {
    console.error('Error updating order status:', error);
    // In a real app, you might want to return a more specific error message
    // and handle it with the FirestorePermissionError architecture.
    return { success: false, message: 'Failed to update order status.' };
  }
}
