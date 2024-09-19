"use client"

import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Heading from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Billboards, Categories } from "@/type-db";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Trash } from "lucide-react";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface CategoryFormProps {
    initialData: Categories;
    billboards: Billboards[];
}

const formSchema = z.object({
    name: z.string().min(1),
    billboardId: z.string().min(1)
});

const CategoryForm = ({ initialData, billboards }: CategoryFormProps) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    });
    const [isLoading, setIsLoading] = useState(false);
    const params = useParams();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const title = initialData ? "Edit Category" : "Create Category";
    const description = initialData ? "Edit a Category" : "Add a new Category";
    const toastMessage = initialData ? "Category updated" : "Category created";
    const action = initialData ? "Save Changes" : "Create Category";

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const { billboardId: formBillId } = form.getValues();
        const matchingBillboard = billboards.find((item) => item.id === formBillId);

        console.log("Form data before submission:", data);
        console.log("Billboard selected:", matchingBillboard);

        try {
            setIsLoading(true);

            if (initialData) {
                console.log("Updating category with data:", data);
                // Update existing category
                await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, {
                    ...data,
                    billboardLabel: matchingBillboard?.label,
                    
                });
                console.log("Category updated successfully");
            } else {
                console.log("Creating new category with data:", data);
                // Create new category
                await axios.post(`/api/${params.storeId}/categories`, {
                    ...data,
                    billboardLabel: matchingBillboard?.label,
                });
                console.log("Category created successfully");
            }

            toast.success(toastMessage);
            router.push(`/${params.storeId}/categories`);
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
            console.log(`Attempting to delete from Firestore: /api/${params.storeId}/categorys/${params.categoryId}`);
            
            await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`);
  
            console.log("Firestore document deleted successfully");
  
            toast.success("Bill board removed");
            location.reload()
            // Redirect after deletion
            router.push(`/${params.storeId}/categories`);
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
                                        placeholder={'Your Category name...'}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField
                            control={form.control}
                            name="billboardId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Select a bill board</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a bill board" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {billboards.map(billboard =>(
                                                <SelectItem key={billboard.id} value={billboard.id}>
                                                    {billboard.label}
                                                </SelectItem>
                                             ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        {description}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={isLoading} type='submit' size={"sm"}>{action}</Button>
                </form>
            </Form>

        </>
    );
}

export default CategoryForm;
