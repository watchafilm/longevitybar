'use server';

import { revalidatePath } from 'next/cache';
import { getFirestore, doc, updateDoc, arrayRemove, arrayUnion, getDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';


export async function updateOrderStatus(orderId: string, itemIndex: number, newStatus: 'served' | 'pending') {
  try {
    const { firestore } = initializeFirebase();
    const orderRef = doc(firestore, 'orders', orderId);
    
    const orderSnap = await getDoc(orderRef);
    if (!orderSnap.exists()) {
      throw new Error("Order not found");
    }

    const orderData = orderSnap.data();
    const itemStatuses = orderData.itemStatuses || orderData.items.map(() => 'pending');

    if (itemIndex < 0 || itemIndex >= itemStatuses.length) {
      throw new Error("Invalid item index");
    }

    itemStatuses[itemIndex] = newStatus;

    await updateDoc(orderRef, { itemStatuses });

    revalidatePath('/kitchen');
    return { success: true, message: 'Order status updated.' };
  } catch (error) {
    console.error('Error in updateOrderStatus action:', error);
    const message = error instanceof Error ? error.message : 'Failed to update order status.';
    return { success: false, message };
  }
}
