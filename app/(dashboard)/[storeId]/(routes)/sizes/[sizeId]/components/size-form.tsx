"use client"

import { useOrigin } from "@/app/hooks/use-origin";
import { AlertModal } from "@/components/modal/alert-modal";
import ApiAlert from "@/components/ui/api-alert";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Heading from "@/components/ui/heading";
import { ImageUpload } from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { storage } from "@/lib/firebase";
import { Billboards, Categories, Sizes } from "@/type-db";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { deleteObject, ref } from "firebase/storage";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface SizeFormProps {
    initialData: Sizes;
    billboards: Billboards[];
}

const formSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(1),
});

const SizeForm = ({ initialData, billboards }: SizeFormProps) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    });
    const [isLoading, setIsLoading] = useState(false);
    const params = useParams();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const origin = useOrigin();
    const title = initialData ? "Edit Size" : "Create Size";
    const description = initialData ? "Edit a Size" : "Add a new Size";
    const toastMessage = initialData ? "Size updated" : "Size created";
    const action = initialData ? "Save Changes" : "Create Size";

    const onSubmit = async (data: z.infer<typeof formSchema>) => {

        try {
            setIsLoading(true);
            console.log(data);
            
            if (initialData) {
                console.log("Updating Size with data:", data);
                // Update existing Size
                await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`, {
                ...data,
                });
                console.log("Size updated successfully");
            } else {
                console.log("Creating new Size with data:", data);
                // Create new Size
                await axios.post(`/api/${params.storeId}/sizes`, {
                 ...data,
                });
                console.log("Size created successfully");
            }

            toast.success(toastMessage);
            router.push(`/${params.storeId}/sizes`);
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
                                        placeholder={'Size name...'}
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
                                        placeholder={'Size Value...'}
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

export default SizeForm;
