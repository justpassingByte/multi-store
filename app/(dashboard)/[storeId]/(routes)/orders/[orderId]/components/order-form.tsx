"use client"

import { useOrigin } from "@/app/hooks/use-origin";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Heading from "@/components/ui/heading";

import { Input } from "@/components/ui/input";

import { Separator } from "@/components/ui/separator";

import { Billboards, Categories, Orders, Sizes } from "@/type-db";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface OrderFormProps {
    initialData: Orders;
    billboards: Billboards[];
}

const formSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(1),
});

const OrderForm = ({ initialData, billboards }: OrderFormProps) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    });
    const [isLoading, setIsLoading] = useState(false);
    const params = useParams();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const origin = useOrigin();
    const title = initialData ? "Edit order" : "Create order";
    const description = initialData ? "Edit a order" : "Add a new order";
    const toastMessage = initialData ? "order updated" : "order created";
    const action = initialData ? "Save Changes" : "Create order";

    const onSubmit = async (data: z.infer<typeof formSchema>) => {

        try {
            setIsLoading(true);
            console.log(data);
            
            if (initialData) {
                console.log("Updating order with data:", data);
                // Update existing order
                await axios.patch(`/api/${params.storeId}/orders/${params.orderId}`, {
                ...data,
                });
                console.log("order updated successfully");
            } else {
                console.log("Creating new order with data:", data);
                // Create new order
                await axios.post(`/api/${params.storeId}/orders`, {
                 ...data,
                });
                console.log("order created successfully");
            }

            toast.success(toastMessage);
            router.push(`/${params.storeId}/orders`);
        } catch (error) {
            console.log("Error during submission:", error);
            toast.error("Something went wrong");
        } finally {
            console.log("Form submission complete, refreshing the page");
            router.refresh();
            setIsLoading(false);
        }
    };
    const onDelete = async () => {
        
        try {
            setIsLoading(true);
  
            // Log the API call to delete the categories in Firestore
            console.log(`Attempting to delete from Firestore: /api/${params.storeId}/kitchens/${params.kitchenId}`);
            
            await axios.delete(`/api/${params.storeId}/cuisines/${params.kitchenId}`);
  
            console.log("Firestore document deleted successfully");
  
            toast.success("Bill board removed");
            location.reload()
            // Redirect after deletion
            router.push(`/${params.storeId}/kitchens`);
        } catch (error) {
            console.error("Error during deletion:", error);
            toast.error("Something went wrong"+ error);
        } finally {
            setIsLoading(false);
            setOpen(false);
        }
    };
   
    return (
        <>
           
           {open && (
            <AlertModal
                isOpen={open} onClose={() => setOpen(false)}
                onConfirm={onDelete} loading={isLoading}               
            />
           )}
            <div className="flex items-center justify-center">
                <Heading title={title} description={description} />
                {initialData && (
                    <Button disabled={isLoading} variant={"destructive"} size={"icon"} onClick={() => setOpen(true)}>
                        <Trash className="w-4 h-4" />
                    </Button>
                )}
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
                    <div className="grid grid-cols-3 gap-8">
                        <FormField control={form.control} name='name' render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isLoading}
                                        placeholder={'order name...'}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name='value' render={({ field }) => (
                            <FormItem>
                                <FormLabel>Value</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isLoading}
                                        placeholder={'order Value...'}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                    <Button disabled={isLoading} type='submit' size={"sm"}>{action}</Button>
                </form>
            </Form>

        </>
    );
}

export default OrderForm;
