'use server';

import { revalidatePath } from 'next/cache';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, App } from 'firebase-admin/app';

// Helper to initialize Firebase Admin SDK on the server.
// It ensures we don't try to re-initialize it on every action call.
function getFirebaseAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }
  // This will use the GOOGLE_APPLICATION_CREDENTIALS environment
  // variable automatically provided by the App Hosting environment.
  return initializeApp();
}


export async function updateOrderStatus(orderId: string, itemIndex: number, newStatus: 'served' | 'pending') {
  try {
    // Correctly get the Firestore instance on the server.
    const app = getFirebaseAdminApp();
    const firestore = getFirestore(app);

    const orderRef = firestore.collection('orders').doc(orderId);
    
    const orderSnap = await orderRef.get();
    if (!orderSnap.exists) {
      throw new Error("Order not found");
    }

    const orderData = orderSnap.data();
    if (!orderData) {
        throw new Error("Order data is empty");
    }

    // Ensure itemStatuses is an array before trying to access it.
    const itemStatuses = orderData.itemStatuses && Array.isArray(orderData.itemStatuses)
      ? [...orderData.itemStatuses]
      : orderData.items.map(() => 'pending');

    if (itemIndex < 0 || itemIndex >= itemStatuses.length) {
      throw new Error("Invalid item index");
    }

    itemStatuses[itemIndex] = newStatus;

    await orderRef.update({ itemStatuses });

    revalidatePath('/kitchen');
    return { success: true, message: 'Order status updated.' };
  } catch (error) {
    console.error('Error in updateOrderStatus action:', error);
    const message = error instanceof Error ? error.message : 'Failed to update order status.';
    return { success: false, message };
  }
}
