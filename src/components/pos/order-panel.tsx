
'use client';

import { useState, useTransition, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { QrCode, PlusCircle, MinusCircle, Trash2, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import type { Drink, OrderItem, PaymentMethod } from '@/lib/types';
import { AnimatePresence, motion } from 'framer-motion';
import { useFirebase } from '@/firebase/provider';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, serverTimestamp } from 'firebase/firestore';
import { DRINKS } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


const QR_CODE_URLS = {
    qr: 'https://drive.google.com/uc?export=view&id=1kt1wQUj32SqfyPEgClwo5m3s6wikFLIH',
}

const PAYMENT_METHODS: { id: PaymentMethod; label: string; icon: React.ElementType }[] = [
  { id: 'qr', label: 'QR Scan', icon: QrCode },
];

export default function OrderPanel() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qr');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { firestore } = useFirebase();

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
      return [...prevItems, { name: drink.name, price: drink.price, quantity: 1, drinkId: drink.id }];
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
     if (!customerName.trim()) {
      toast({
        title: "Customer Name Required",
        description: "Please enter the customer's name.",
        variant: "destructive",
      });
      return;
    }
    if (!firestore) {
      toast({
        title: "Submission Failed",
        description: "Firestore is not available. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    startTransition(() => {
      try {
        const ordersCollection = collection(firestore, 'orders');
        addDocumentNonBlocking(ordersCollection, {
          customerName,
          items: orderItems,
          totalAmount,
          paymentMethod,
          status: 'pending',
          createdAt: serverTimestamp(),
        });
  
        toast({
          title: "Order Submitted",
          description: "The order has been submitted to the kitchen.",
          action: <CheckCircle className="text-green-500" />,
        });
        setOrderItems([]);
        setCustomerName('');
        setPaymentMethod('qr');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create order.';
        toast({
          title: "Submission Failed",
          description: errorMessage,
          variant: "destructive",
          action: <XCircle className="text-white"/>,
        });
      }
    });
  };

  const getBgColorClass = (drinkId: string) => {
    switch (drinkId) {
      case 'drink_1': return 'bg-drink-green/10';
      case 'drink_2': return 'bg-drink-red/10';
      case 'drink_3': return 'bg-drink-yellow/10';
      default: return '';
    }
  }

  return (
    <>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      {/* Drink Selection Panel */}
      <div className="lg:col-span-1 flex flex-col gap-4 h-full">
        {DRINKS.map((drink) => (
            <Card key={drink.name} className={cn("overflow-hidden group flex flex-row flex-1", getBgColorClass(drink.id))}>
                <div className="relative w-40 h-full">
                    <Image
                        src={drink.imageUrl}
                        alt={drink.name}
                        fill
                        className="object-cover object-top transform group-hover:scale-110 transition-transform duration-300 p-4"
                    />
                </div>
                <div className="flex flex-col p-4 flex-grow justify-center">
                    <h3 className={`font-headline text-xl font-semibold ${drink.color}`}>{drink.name}</h3>
                    <p className="text-muted-foreground font-medium mb-4">{drink.price} THB</p>
                    <div className="mt-auto">
                        <Button onClick={() => handleAddItem(drink)} className="w-full">
                            <PlusCircle className="mr-2 h-4 w-4" /> Add
                        </Button>
                    </div>
                </div>
            </Card>
        ))}
      </div>

      {/* Order Summary Panel */}
      <div className="lg:col-span-1 flex flex-col h-full">
        <Card className="flex flex-col flex-grow">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Current Order</CardTitle>
            <CardDescription>
              Review items before confirming
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col">
            <div className="space-y-2 mb-4">
                <Label htmlFor="customerName" className="text-lg">Customer Name</Label>
                <Input 
                  id="customerName" 
                  placeholder="Enter customer's name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="h-12 text-lg"
                />
            </div>
            <Separator />
            <div className="flex-grow overflow-auto pr-2">
                {orderItems.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground text-center py-8">No items in order.</p>
                  </div>
                ) : (
                  <div className="h-full overflow-y-auto">
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
            </div>
          </CardContent>
          <CardFooter className="flex-col !p-4 !pt-0 mt-auto bg-card">
              <div className="w-full">
                  <Separator className="my-4"/>
                  <div className="flex justify-between items-center mb-4">
                  <span className="font-headline text-lg">Total</span>
                  <span className="font-headline text-3xl font-bold">{totalAmount.toFixed(2)} THB</span>
                  </div>
              </div>
              <Button size="lg" className="w-full font-bold text-lg" onClick={handleSubmitOrder} disabled={isPending || orderItems.length === 0}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting...
                  </>
                ) : (
                  'Confirm Order'
                )}
              </Button>
          </CardFooter>
        </Card>
      </div>

      {/* QR Code and Payment Panel */}
      <div className="lg:col-span-1 flex flex-col h-full">
        <Card className="flex flex-col flex-grow">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Scan to Pay</CardTitle>
            <CardDescription>
                Scan the QR code to complete the payment.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col items-center justify-center">
             <div className="relative w-full h-full aspect-square">
                <Image 
                    src={QR_CODE_URLS.qr} 
                    alt="QR Code for payment" 
                    fill
                    className="object-contain rounded-lg"
                />
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground w-full text-center">Payment via QR is the only available method.</p>
          </CardFooter>
        </Card>
      </div>

    </div>
    </>
  );
}
