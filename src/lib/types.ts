import type { Timestamp } from 'firebase/firestore';

export type Drink = {
    name: 'Green' | 'Red' | 'Yellow';
    price: number;
    color: string;
    bgColor: string;
};

export type OrderItem = {
    name: Drink['name'];
    quantity: number;
    price: number;
};

export type PaymentMethod = 'cash' | 'qr' | 'credit_card_qr';

export type OrderStatus = 'pending' | 'served';

export type Order = {
    id: string;
    items: OrderItem[];
    totalAmount: number;
    paymentMethod: PaymentMethod;
    status: OrderStatus;
    createdAt: Timestamp;
};

export type OrderPayload = Omit<Order, 'id' | 'createdAt' | 'status'>;
