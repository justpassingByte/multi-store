// components/GenericForm.tsx
"use client"

import { useOrigin } from "@/app/hooks/use-origin";
import ApiAlert from "@/components/ui/api-alert";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Heading from "@/components/ui/heading";
import { ImageUpload } from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface GenericFormProps<T> {
    initialData: T;
    formSchema: z.ZodSchema<T>;
    title: string;
    description: string;
    apiPath: string;
    imageLabel: string;
    nameLabel: string;
    onSuccessMessage: string;
    onErrorMessage: string;
}

const GenericForm = <T,>({
    initialData,
    formSchema,
    title,
    description,
    apiPath,
    imageLabel,
    nameLabel,
    onSuccessMessage,
    onErrorMessage
}: GenericFormProps<T>) => {
    const form = useForm<T>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    });
    const [isLoading, setIsLoading] = useState(false);
    const params = useParams();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const origin = useOrigin();
    const action = initialData ? "Save Changes" : "Create";

    const onSubmit = async (data: T) => {
        console.log("Form data:", data);

        try {
            if (initialData) {
                await axios.patch(`${apiPath}/${params.id}`, data);
                toast.success(onSuccessMessage);
            } else {
                setIsLoading(true);
                await axios.post(apiPath, data);
                toast.success(onSuccessMessage);
            }
            router.push(apiPath);
        } catch (error) {
            console.log("Error:", error);
            toast.error(onErrorMessage);
        } finally {
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
                    <FormField control={form.control} name='imageUrl' render={({ field }) => (
                        <FormItem>
                            <FormLabel>{imageLabel}</FormLabel>
                            <FormControl>
                                <ImageUpload
                                    value={field.value ? [field.value] : []}
                                    disable={isLoading}
                                    onChange={(url) => field.onChange(url)}
                                    onRemove={() => field.onChange("")}
                                />
                            </FormControl>
                        </FormItem>
                    )} />
                    <div className="grid grid-cols-3 gap-8">
                        <FormField control={form.control} name='label' render={({ field }) => (
                            <FormItem>
                                <FormLabel>{nameLabel}</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isLoading}
                                        placeholder={'Enter name...'}
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
            <Separator />
            <ApiAlert title="NEXT_PUBLIC_API_URL" description={`${origin}/api/${params.id}`} variant="public" />
        </>
    );
};

export default GenericForm;
