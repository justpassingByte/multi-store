"use client"

import { useOrigin } from "@/app/hooks/use-origin";
import { AlertModal } from "@/components/modal/alert-modal";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Heading from "@/components/ui/heading";

import { Input } from "@/components/ui/input";

import { Separator } from "@/components/ui/separator";

import { Cuisines } from "@/type-db";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface CuisineFormProps {
    initialData: Cuisines;
}

const formSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(1),
});

const CuisineForm = ({ initialData }: CuisineFormProps) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    });
    const [isLoading, setIsLoading] = useState(false);
    const params = useParams();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const title = initialData ? "Edit Cuisine" : "Create Cuisine";
    const description = initialData ? "Edit a Cuisine" : "Add a new Cuisine";
    const toastMessage = initialData ? "Cuisine updated" : "Cuisine created";
    const action = initialData ? "Save Changes" : "Create Cuisine";

    const onSubmit = async (data: z.infer<typeof formSchema>) => {

        try {
            setIsLoading(true);
            console.log(data);
            
            if (initialData) {
                console.log("Updating Cuisine with data:", data);
                // Update existing Cuisine
                await axios.patch(`/api/${params.storeId}/cuisines/${params.cuisineId}`, {
                ...data,
                });
                console.log("Cuisine updated successfully");
            } else {
                console.log("Creating new Cuisine with data:", data);
                // Create new Cuisine
                await axios.post(`/api/${params.storeId}/cuisines`, {
                 ...data,
                });
                console.log("Cuisine created successfully");
            }

            toast.success(toastMessage);
            router.push(`/${params.storeId}/cuisines`);
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
            console.log(`Attempting to delete from Firestore: /api/${params.storeId}/cuisines/${params.cuisineId}`);
            
            await axios.delete(`/api/${params.storeId}/cuisines/${params.cuisineId}`);
  
            console.log("Firestore document deleted successfully");
  
            toast.success("Cuisineremoved");
            location.reload()
            // Redirect after deletion
            router.push(`/${params.storeId}/cuisines`);
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
                                        placeholder={'Cuisine name...'}
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
                                        placeholder={'Cuisine Value...'}
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

export default CuisineForm;
