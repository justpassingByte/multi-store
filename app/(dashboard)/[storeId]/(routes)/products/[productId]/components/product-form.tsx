"use client"

import { useOrigin } from "@/app/hooks/use-origin";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Heading from "@/components/ui/heading";
import { ImagesUpload } from "@/components/ui/images-upload";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Billboards, Categories, Products, Kitchens, Cuisines, Sizes } from "@/type-db";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface ProductFormProps {
    initialData: Products;
    billboards: Billboards[];
    categories: Categories[];
    kitchens: Kitchens[];
    cuisines: Cuisines[];
    sizes: Sizes[];
}

const formSchema = z.object({
    name: z.string().min(1),
    price: z.coerce.number().min(1),
    size: z.string().min(1),
    category: z.string().min(1),
    kitchen: z.string().min(1),
    cuisine: z.string().min(1),
    isFeature: z.boolean().default(false).optional(),
    isArchieve: z.boolean().default(false).optional(),
    images: z.object({ url: z.string() }).array()
});

const ProductForm = ({ initialData, billboards, categories, kitchens, cuisines, sizes }: ProductFormProps) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: "",
            price: 0,
            images:[],
            isFeature:false,
            isArchieve:false,
            category:"",
            size:"",
            kitchen: "",
        }
    });
    const [isLoading, setIsLoading] = useState(false);
    const params = useParams();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const origin = useOrigin();
    const title = initialData ? "Edit Product" : "Create Product";
    const description = initialData ? "Edit a Product" : "Add a new Product";
    const toastMessage = initialData ? "Product updated" : "Product created";
    const action = initialData ? "Save Changes" : "Create Product";

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true);
            console.log("Form data:", data);
            data.isFeature = data.isFeature ?? false;
            data.isArchieve = data.isArchieve ?? false;
            if (initialData) {
                console.log("Updating Product with data:", data);
                // Update existing Product
                const response = await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data);
                console.log("Product updated successfully:", response.data);
            } else {
                console.log("Creating new Product with data:", data);
                // Create new Product
                const response = await axios.post(`/api/${params.storeId}/products`, data);
                console.log("Product created successfully:", response.data);
            }
    
            toast.success(toastMessage);
            router.push(`/${params.storeId}/products`);
        } catch (error) {
            console.error("Error during submission:", error.response ? error.response.data : error.message);
            toast.error("Something went wrong");
        } finally {
            console.log("Form submission complete");
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
                    {/* Image Upload Row */}
                    <FormField control={form.control} name='images' render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product Image</FormLabel>
                            <FormControl>
                                <ImagesUpload
                                    value={(field.value || []).map(image => image.url)}
                                    disable={isLoading}
                                    onChange={(urls) => field.onChange(urls.map(url => ({ url })))}
                                    onRemove={() => field.onChange([])}
                                />
                            </FormControl>
                        </FormItem>
                    )} />

                    {/* Form Fields Grid */}
                    <div className="grid grid-cols-3 gap-8">
                        <FormField control={form.control} name='name' render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isLoading}
                                        placeholder='Product name...'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name='price' render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isLoading}
                                        placeholder='0'
                                        type="number"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name='size' render={({ field }) => (
                            <FormItem>
                                <FormLabel>Size</FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select sizes" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {sizes.map((size) => (
                                                <SelectItem key={size.id} value={size.name}>
                                                    {size.value}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name='category' render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} value={field.value} disabled={isLoading} className="w-full">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.name}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name='kitchen' render={({ field }) => (
                            <FormItem>
                                <FormLabel>Kitchen</FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} value={field.value} disabled={isLoading} className="w-full">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select kitchen" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {kitchens.map((kitchen) => (
                                                <SelectItem key={kitchen.id} value={kitchen.name}>
                                                    {kitchen.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name='cuisine' render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cuisine</FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} value={field.value} disabled={isLoading} className="w-full">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select cuisine" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {cuisines.map((cuisine) => (
                                                <SelectItem key={cuisine.id} value={cuisine.name}>
                                                    {cuisine.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name='isFeature' render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                        Feature
                                    </FormLabel>
                                    <FormDescription>
                                        This product will be on home screen under feature product
                                    </FormDescription>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name='isArchieve' render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3">

                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                        Archieve
                                    </FormLabel>
                                    <FormDescription>
                                        This product will not be display on anywhere indside the store
                                    </FormDescription>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>

                    {/* Submit Button */}
                    <Button disabled={isLoading} type='submit' size={"sm"}>{action}</Button>
                </form>
            </Form>
        </>
    );
}

export default ProductForm;
