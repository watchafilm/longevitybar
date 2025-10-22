'use server';

import type { OrderPayload } from '@/lib/types';

// This is a mock function since we removed Firebase.
// In a real application, this would interact with a database.
export async function createOrder(orderData: OrderPayload) {
  try {
    console.log('Order created:', orderData);
    // Simulate a successful API call
    await new Promise(resolve => setTimeout(resolve, 500)); 
    return { success: true, message: 'Order created successfully.' };
  } catch (error) {
    console.error('Error in createOrder action:', error);
    return { success: false, message: (error as Error).message || 'Failed to create order.' };
  }
}

// This is a mock function since we removed Firebase.
export async function updateOrderStatus(orderId: string, status: 'pending' | 'served') {
  try {
    console.log(`Order ${orderId} status updated to ${status}`);
    // Simulate a successful API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, message: 'Order status updated.' };
  } catch (error) {
    console.error('Error in updateOrderStatus action:', error);
    return { success: false, message: (error as Error).message || 'Failed to update order status.' };
  }
}
