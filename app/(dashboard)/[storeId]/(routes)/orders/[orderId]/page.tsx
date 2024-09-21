"use client";
import { db } from '@/lib/firebase';
import { Orders, Products } from '@/type-db';
import { collection, doc, getDoc, getDocs, Timestamp, updateDoc } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Truck } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios'
import { useRouter } from 'next/navigation';
const OrderPage = ({
    params,
}: {
    params: { storeId: string; orderId: string };
}) => {
    const [currentOrder, setCurrentOrder] = useState<Orders | null>(null);
    const [orders, setOrders] = useState<Orders[]>([]);
    const [loading, setLoading] = useState(true);
    const route = useRouter()
    useEffect(() => {
        const fetchData = async () => {
            try {
                const orderDoc = await getDoc(
                    doc(db, 'stores', params.storeId, 'orders', params.orderId)
                );

                const order = orderDoc.data() as Orders;
                setCurrentOrder(order);

                const ordersSnapshot = await getDocs(
                    collection(db, 'stores', params.storeId, 'orders')
                );

                const fetchedOrders = ordersSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Orders[];

                setOrders(fetchedOrders);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        console.log(orders);
        
        fetchData();
    }, [params.storeId, params.orderId]);

    const calculateTotalPrice = (products: Products[]) => {
        return products.reduce((total, product) => {
            return total + (product.price || 0) * (product.qty || 0);
        }, 0);
    };

    const totalPrice = currentOrder ? calculateTotalPrice(currentOrder.orderItems) : 0;

    const handleStatusChange = async (newStatus: string) => {
        if (currentOrder) {
            const finalizedStatuses = new Set(['Cancelled', 'Delivered']);
            
            // Check if current status is a finalized status
            if (finalizedStatuses.has(currentOrder.order_status)) {
                toast.error("You cannot change the status after it has been finalized.");
                return;
            }
    
            const updatedOrder = { ...currentOrder, order_status: newStatus };
            setCurrentOrder(updatedOrder);
    
            await updateDoc(doc(db, 'stores', params.storeId, 'orders', currentOrder.id), {
                order_status: newStatus,
            });
        }
    };
    const handleSaveChange = async () => {
        if (currentOrder) {
            const newStatus = currentOrder.order_status; 

            try {
                const response = await axios.patch(`/api/orders/${currentOrder.id}`, {
                    order_status: newStatus,
                });

                if (response.status === 200) {
                    toast.success("Order status updated successfully!");
                    route.refresh()
                    route.push('/orders')
                }
            } catch (error) {
                console.error("Error updating order status:", error);
                toast.error("Failed to update order status.");
            }
        }
    };

    // const formattedDate = currentOrder?.createAt
    //     ? new Timestamp(currentOrder.createAt.seconds, currentOrder.createAt.nanoseconds).toDate().toLocaleDateString()
    //     : '';

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Order Details</h1>
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Order #{currentOrder?.id}</CardTitle>
                        {/* <p className="text-sm text-muted-foreground">Placed on {formattedDate}</p> */}
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead className="text-right">Quantity</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentOrder?.orderItems.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell className="text-right">{product.qty}</TableCell>
                                        <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Customer</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="font-medium">{currentOrder?.phone}</p>
                            <p className="text-sm text-muted-foreground mt-2">{currentOrder?.address}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between font-bold">
                                <span>Total</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Label htmlFor="status">Current Status</Label>
                            <Select
                                defaultValue={currentOrder?.order_status}
                                onValueChange={handleStatusChange}
                               
                            >
                                <SelectTrigger id="status">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Processing">Processing</SelectItem>
                                    <SelectItem value="Shipped">Shipped</SelectItem>
                                    <SelectItem value="Delivered">Delivered</SelectItem>
                                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>

                        </CardContent>
                        <CardFooter className="flex justify-center">
                            <Button onClick={() => handleSaveChange()}><Truck className="mr-2 h-4 w-4" /> Save Change</Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default OrderPage;
