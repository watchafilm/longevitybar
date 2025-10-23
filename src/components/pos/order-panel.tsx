
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


const QR_CODE_URLS = {
    qr: 'https://drive.google.com/uc?export=view&id=1kt1wQUj32SqfyPEgClwo5m3s6wikFLIH',
}

const PAYMENT_METHODS: { id: PaymentMethod; label: string; icon: React.ElementType }[] = [
  { id: 'qr', label: 'QR Scan', icon: QrCode },
];

export default function OrderPanel() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qr');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [showQr, setShowQr] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(QR_CODE_URLS.qr);
  const { firestore } = useFirebase();

  const totalAmount = useMemo(() => {
    return orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [orderItems]);

  const handleSetPaymentMethod = (method: PaymentMethod) => {
    setPaymentMethod(method);
    if (method === 'qr') {
      setQrCodeUrl(QR_CODE_URLS[method]);
      setShowQr(true);
    } else {
      setShowQr(false);
      setQrCodeUrl(null);
    }
  };

  useEffect(() => {
    // Set default payment method and QR code on initial render
    handleSetPaymentMethod('qr');
  }, []);

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
        setShowQr(true);
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      <div className="flex flex-col gap-4 h-full">
        {DRINKS.map((drink) => (
            <Card key={drink.name} className={cn("overflow-hidden group flex flex-row flex-1", getBgColorClass(drink.id))}>
                <div className="relative w-56 h-full">
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

      <div className="flex flex-col h-full">
        <Card className="flex flex-col flex-grow">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Current Order</CardTitle>
            <CardDescription className="min-h-[20px]">
              <AnimatePresence initial={false} mode="wait">
                <motion.span
                  key={showQr ? 'qr-text' : 'review-text'}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="inline-block"
                >
                  {showQr ? `Scan to pay ${totalAmount.toFixed(2)} THB` : "Review items before confirming"}
                </motion.span>
              </AnimatePresence>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col">
            <Separator />
            <div className="relative flex-grow min-h-[260px] overflow-auto">
              <AnimatePresence mode="wait">
                {showQr && qrCodeUrl ? (
                  <motion.div
                    key="qr-code"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex flex-col items-center justify-center text-center p-4"
                  >
                    <div className="relative w-full h-full">
                      <Image 
                        src={qrCodeUrl} 
                        alt="QR Code for payment" 
                        fill
                        className="object-contain rounded-lg"
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="order-items"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0"
                  >
                    {orderItems.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground text-center py-8">No items in order.</p>
                      </div>
                    ) : (
                      <div className="h-full overflow-y-auto pr-2">
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
          <CardFooter className="flex-col !p-4 !pt-0 mt-auto bg-card">
            <div className="w-full">
                <Separator className="my-4"/>
                <h4 className="font-headline text-lg mb-2">Payment Method</h4>
                <div className="grid grid-cols-1 gap-2 mb-4">
                    {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => (
                    <Button
                        key={id}
                        variant={paymentMethod === id ? 'default' : 'outline'}
                        onClick={() => handleSetPaymentMethod(id)}
                        className="flex flex-col h-16"
                    >
                        <Icon className="h-6 w-6 mb-1" />
                        <span className="text-xs">{label}</span>
                    </Button>
                    ))}
                </div>
                <Separator className="my-4"/>
                <div className="flex justify-between items-center mb-4">
                <span className="font-headline text-lg">Total</span>
                <span className="font-headline text-3xl font-bold">{totalAmount.toFixed(2)} THB</span>
                </div>
            </div>
            <Button size="lg" className="w-full font-bold text-lg" onClick={handleSubmitOrder} disabled={isPending || orderItems.length === 0}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> {showQr ? 'Confirming...' : 'Submitting...'}
                </>
              ) : (
                'Confirm Payment'
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
    </>
  );
}

    