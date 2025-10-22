'use client';

import { useState, useTransition, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Wallet, QrCode, CreditCard, PlusCircle, MinusCircle, Trash2, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { createOrder } from '@/lib/actions';
import type { Drink, OrderItem, PaymentMethod } from '@/lib/types';

const DRINKS: Drink[] = [
  { name: 'Bitkub Awakening', price: 88, color: 'text-green-500', bgColor: 'bg-green-500' },
  { name: 'Crimson Flow', price: 88, color: 'text-red-500', bgColor: 'bg-red-500' },
  { name: 'Elysian Pulse', price: 88, color: 'text-yellow-500', bgColor: 'bg-yellow-500' },
];

const PAYMENT_METHODS: { id: PaymentMethod; label: string; icon: React.ElementType }[] = [
  { id: 'cash', label: 'Cash', icon: Wallet },
  { id: 'qr', label: 'QR Scan', icon: QrCode },
  { id: 'credit_card_qr', label: 'Credit Card QR', icon: CreditCard },
];

export default function OrderPanel() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const totalAmount = useMemo(() => {
    return orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [orderItems]);

  const handleAddItem = (drink: Drink) => {
    setOrderItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.name === drink.name);
      if (existingItem) {
        return prevItems.map((item) =>
          item.name === drink.name ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { name: drink.name, price: drink.price, quantity: 1 }];
    });
  };

  const handleRemoveItem = (drinkName: Drink['name']) => {
    setOrderItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.name === drinkName);
      if (existingItem && existingItem.quantity > 1) {
        return prevItems.map((item) =>
          item.name === drinkName ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return prevItems.filter((item) => item.name !== drinkName);
    });
  };
  
  const handleClearItem = (drinkName: Drink['name']) => {
    setOrderItems(prevItems => prevItems.filter(item => item.name !== drinkName));
  };


  const handleSubmitOrder = async () => {
    if (orderItems.length === 0) {
      toast({
        title: "Empty Order",
        description: "Please add items to the order before submitting.",
        variant: "destructive",
      });
      return;
    }

    startTransition(async () => {
      const result = await createOrder({
        items: orderItems,
        totalAmount,
        paymentMethod,
      });

      if (result.success) {
        toast({
          title: "Order Submitted",
          description: "The order has been sent to the kitchen.",
          action: <CheckCircle className="text-green-500" />,
        });
        setOrderItems([]);
      } else {
        toast({
          title: "Submission Failed",
          description: result.message,
          variant: "destructive",
          action: <XCircle className="text-white"/>,
        });
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-2">
        <h1 className="font-headline text-4xl font-bold mb-6">Point of Sale</h1>
        <div className="grid grid-cols-1 gap-6">
          {DRINKS.map((drink) => (
            <Card key={drink.name} className="overflow-hidden group">
              <CardHeader className="p-0">
                <div className={cn("h-32 w-full", drink.bgColor)}></div>
              </CardHeader>
              <CardContent className="p-4">
                <h3 className={`font-headline text-2xl font-semibold ${drink.color}`}>{drink.name}</h3>
                <p className="text-muted-foreground font-medium">{drink.price} THB</p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full" onClick={() => handleAddItem(drink)}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add to Order
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <Card className="sticky top-20">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Current Order</CardTitle>
          <CardDescription>Review items before confirming</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Separator />
          {orderItems.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No items in order.</p>
          ) : (
            <div className="max-h-60 overflow-y-auto pr-2">
              {orderItems.map((item) => (
                <div key={item.name} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.price} THB</p>
                  </div>
                  <div className="flex items-center gap-2">
                     <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleRemoveItem(item.name)}>
                        <MinusCircle className="h-4 w-4"/>
                    </Button>
                    <span className="font-bold w-4 text-center">{item.quantity}</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleAddItem(DRINKS.find(d => d.name === item.name)!)}>
                        <PlusCircle className="h-4 w-4"/>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive/70 hover:text-destructive" onClick={() => handleClearItem(item.name)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Separator />
          <div className="space-y-2">
            <h4 className="font-headline text-lg">Payment Method</h4>
            <div className="grid grid-cols-3 gap-2">
              {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => (
                <Button
                  key={id}
                  variant={paymentMethod === id ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod(id)}
                  className="flex flex-col h-16"
                >
                  <Icon className="h-6 w-6 mb-1" />
                  <span className="text-xs">{label}</span>
                </Button>
              ))}
            </div>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="font-headline text-lg">Total</span>
            <span className="font-headline text-3xl font-bold">{totalAmount.toFixed(2)} THB</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button size="lg" className="w-full font-bold text-lg" onClick={handleSubmitOrder} disabled={isPending || orderItems.length === 0}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting...
              </>
            ) : (
              'Confirm Payment'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
