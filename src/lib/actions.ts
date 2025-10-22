'use server';

import { revalidatePath } from 'next/cache';
import { collection, doc, serverTimestamp } from 'firebase/firestore';
import { getSdks, initializeFirebase } from '@/firebase';
import { addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import type { OrderPayload } from '@/lib/types';

// No need for a separate getFirestoreInstance function, initializeFirebase handles it.

export async function createOrder(orderData: OrderPayload) {
  try {
    const { firestore } = initializeFirebase();
    // Using the non-blocking function that correctly handles permission errors.
    addDocumentNonBlocking(collection(firestore, 'orders'), {
      ...orderData,
      status: 'pending',
      createdAt: serverTimestamp(),
    });

    revalidatePath('/kitchen');
    revalidatePath('/summary');
    
    return { success: true, message: 'Order created successfully.' };
  } catch (error) {
    console.error('Error in createOrder action:', error);
    // The non-blocking function will emit the detailed error,
    // but we can still return a generic failure message to the client toast.
    // The detailed error will appear in the development console overlay.
    return { success: false, message: (error as Error).message || 'Failed to create order.' };
  }
}

export async function updateOrderStatus(orderId: string, status: 'pending' | 'served') {
  try {
    const { firestore } = initializeFirebase();
    const orderRef = doc(firestore, 'orders', orderId);
    
    // Using the non-blocking update function.
    updateDocumentNonBlocking(orderRef, { status });

    revalidatePath('/kitchen');
    revalidatePath('/summary');

    return { success: true, message: 'Order status updated.' };
  } catch (error) {
    console.error('Error in updateOrderStatus action:', error);
    return { success: false, message: (error as Error).message || 'Failed to update order status.' };
  }
}
