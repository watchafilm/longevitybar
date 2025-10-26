
import { Timestamp } from "firebase/firestore";

export type Drink = {
    id: string;
    name: 'Bitkub Awakening' | 'Crimson Flow' | 'Elysian Pulse';
    price: number;
    color: string;
    bgColor: string;
    imageUrl: string;
};

export type OrderItem = {
    drinkId: string;
    name: Drink['name'];
    quantity: number;
    price: number;
};

export type PaymentMethod = 'cash' | 'qr' | 'credit_card_qr';

export type OrderStatus = 'pending' | 'served';

export type Order = {
    id: string;
    customerName: string;
    items: OrderItem[];
    totalAmount: number;
    paymentMethod: PaymentMethod;
    status: OrderStatus;
    createdAt: Timestamp | Date;
};

export type OrderPayload = Omit<Order, 'id' | 'createdAt' | 'status'>;

export type DrinkSummary = {
    name: string;
    quantity: number;
    revenue: number;
};

export type Summary = {
    totalRevenue: number;
    totalOrders: number;
    mostPopularDrink: string;
    drinkSummaries: DrinkSummary[];
};


