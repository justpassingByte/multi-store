"use client"

import { useOrigin } from "@/app/hooks/use-origin";


import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Heading from "@/components/ui/heading";

import { Input } from "@/components/ui/input";

import { Separator } from "@/components/ui/separator";

import { Billboards, Kitchens } from "@/type-db";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface KitchenFormProps {
    initialData: Kitchens;
    billboards: Billboards[];
}

const formSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(1),
});

const KitchenForm = ({ initialData, billboards }: KitchenFormProps) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    });
    const [isLoading, setIsLoading] = useState(false);
    const params = useParams();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const origin = useOrigin();
    const title = initialData ? "Edit Kitchen" : "Create Kitchen";
    const description = initialData ? "Edit a Kitchen" : "Add a new Kitchen";
    const toastMessage = initialData ? "Kitchen updated" : "Kitchen created";
    const action = initialData ? "Save Changes" : "Create Kitchen";

    const onSubmit = async (data: z.infer<typeof formSchema>) => {

        try {
            setIsLoading(true);
            console.log(data);

            if (initialData) {
                console.log("Updating Kitchen with data:", data);
                // Update existing Kitchen
                await axios.patch(`/api/${params.storeId}/kitchens/${params.kitchenId}`, {
                    ...data,
                });
                console.log("Kitchen updated successfully");
            } else {
                console.log("Creating new Kitchen with data:", data);
                // Create new Kitchen
                await axios.post(`/api/${params.storeId}/kitchens`, {
                    ...data,
                });
                console.log("Kitchen created successfully");
            }

            toast.success(toastMessage);
            router.push(`/${params.storeId}/kitchens`);
        } catch (error) {
            console.log("Error during submission:", error);
            toast.error("Something went wrong");
        } finally {
            console.log("Form submission complete, refreshing the page");
            router.refresh();
            setIsLoading(false);
        }
    };
    return (
        <>
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
                                        placeholder={'Kitchen name...'}
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
                                        placeholder={'Kitchen Value...'}
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

export default KitchenForm;
