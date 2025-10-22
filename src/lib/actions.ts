'use server';

import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import type { OrderPayload } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function createOrder(orderData: OrderPayload) {
  try {
    const { firestore } = initializeFirebase();
    const ordersCollection = collection(firestore, 'orders');
    
    await addDoc(ordersCollection, {
      ...orderData,
      status: 'pending',
      createdAt: serverTimestamp(),
    });

    // Revalidate paths to show new data
    revalidatePath('/');
    
    return { success: true, message: 'Order created successfully.' };

  } catch (error) {
    console.error('Error in createOrder action:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create order.';
    return { success: false, message: errorMessage };
  }
}

export async function updateOrderStatus(orderId: string, status: 'pending' | 'served') {
  // This function is not used in this step but is kept for future use.
  try {
    console.log(`Order ${orderId} status updated to ${status}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, message: 'Order status updated.' };
  } catch (error) {
    console.error('Error in updateOrderStatus action:', error);
    return { success: false, message: (error as Error).message || 'Failed to update order status.' };
  }
}
