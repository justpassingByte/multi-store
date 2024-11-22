"use client";

import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Heading from "@/components/ui/heading";
import { ImagesUpload } from "@/components/ui/images-upload";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Products } from "@/type-db";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface ComboFormProps {
  initialData: {
    name: string;
    price: number;
    description: string;
    images: { url: string }[];
    products: string[];  // Array of product IDs
  } | null;
  products: Products[];  // Array of product objects with 'id' and 'name'
}

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().min(1, "Price must be greater than zero"),
  description: z.string().min(1, "Description is required"),
  images: z.array(z.object({ url: z.string().url("Must be a valid URL") })),
  products: z.array(z.string()).min(1, "Select at least one product"),  // Array of product IDs (strings)
});

const ComboForm = ({ initialData, products }: ComboFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
        name: initialData.name,
        price: initialData.price,
        description: initialData.description,
        images: initialData.images,
        products: initialData.products,  // Default products should be IDs
      }
      : {
        name: "",
        price: 0,
        description: "",
        images: [],
        products: [],  // Default to an empty array for product IDs
      },
  });

  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const title = initialData ? "Edit Combo" : "Create Combo";
  const toastMessage = initialData ? "Combo updated" : "Combo created";
  const action = initialData ? "Save Changes" : "Create Combo";

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      console.log("Form data:", data);

      // Convert selected product names to IDs if necessary
      const productIds = products
        .filter((product) => data.products.includes(product.id))  // Match by product IDs
        .map((product) => product.id);  // Extract corresponding product IDs

      const payload = {
        ...data,
        products: productIds, // Ensure we're sending product IDs
      };

      if (initialData) {
        console.log("Updating Combo with data:", payload);
        // Update existing Combo
        const response = await axios.patch(`/api/${params.storeId}/combos/${params.comboId}`, payload);
        console.log("Combo updated successfully:", response.data);
      } else {
        console.log("Creating new combo with data:", payload);
        // Create new combo
        const response = await axios.post(`/api/${params.storeId}/combos`, payload);
        console.log("Combo created successfully:", response.data);
      }

      toast.success(toastMessage);
      router.push(`/${params.storeId}/combos`);
    } catch (error) {
      console.error("Error during submission:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/${params.storeId}/combos/${params.comboId}`);
      toast.success("Combo deleted");
      router.push(`/${params.storeId}/combos`);
    } catch (error) {
      console.error("Error deleting combo:", error);
      toast.error("Failed to delete combo. Please check the console for details.");
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      {open && <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={isLoading} />}
      <div className="flex items-center justify-between">
        <Heading title={title} />
        {initialData && (
          <Button disabled={isLoading} variant="destructive" size="icon" onClick={() => setOpen(true)}>
            <Trash className="w-4 h-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
          {/* Image Upload */}
          <FormField control={form.control} name="images" render={({ field }) => (
            <FormItem>
              <FormLabel>Combo Images</FormLabel>
              <FormControl>
                <ImagesUpload
                  value={(field.value || []).map(image => image.url)}
                  disable={isLoading}
                  onChange={(urls) => field.onChange(urls.map(url => ({ url })))}
                  onRemove={() => field.onChange([])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Combo Details */}
          <div className="grid grid-cols-2 gap-8">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input disabled={isLoading} placeholder="Combo name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="price" render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input disabled={isLoading} placeholder="0" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input disabled={isLoading} placeholder="Combo description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          {/* Product Selection with Checkboxes */}
          <FormField control={form.control} name="products" render={({ field }) => (
            <FormItem>
              <FormLabel>Products in Combo</FormLabel>
              <div className="grid grid-cols-2 gap-4">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center">
                    <Checkbox
                      checked={field.value.includes(product.id)}
                      onCheckedChange={(isChecked) => {
                        const updatedProducts = isChecked
                          ? [...field.value, product.id]
                          : field.value.filter((id) => id !== product.id);
                        field.onChange(updatedProducts); // Update the field value with product IDs
                      }}
                      disabled={isLoading}
                    />
                    <span className="ml-2">{product.name}</span>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )} />

          {/* Submit Button */}
          <Button disabled={isLoading} type="submit" size="sm">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default ComboForm;
