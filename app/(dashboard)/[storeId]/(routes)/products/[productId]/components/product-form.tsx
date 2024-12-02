"use client"


import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Heading from "@/components/ui/heading";
import { ImagesUpload } from "@/components/ui/images-upload";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Categories, Products, Kitchens, Cuisines, Sizes } from "@/type-db";
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
  description: z.string().min(1),
  ingredients: z.string().min(1),
  calories: z.coerce.number().min(0),
  protein: z.coerce.number().min(0),
  carbs: z.coerce.number().min(0),
  fat: z.coerce.number().min(0),
  isFeature: z.boolean().default(false).optional(),
  isArchieve: z.boolean().default(false).optional(),
  images: z.object({ url: z.string() }).array()
});

const ProductForm = ({ initialData, categories, kitchens, cuisines, sizes }: ProductFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      price: 0,
      images: [],
      isFeature: false,
      isArchieve: false,
      category: "",
      size: "",
      kitchen: "",
      descriptions: "",
      ingredients: "",
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const title = initialData ? "Edit Product" : "Create Product";
  const description = initialData ? "Edit a Product" : "Add a new Product";
  const toastMessage = initialData ? "Product updated" : "Product created";
  const action = initialData ? "Save Changes" : "Create Product";
  const sampleMenu = [
    {
      name: "Salad rau củ tươi",
      price: 8.99,
      images: ["url_to_image1"],
      isFeature: true,
      isArchieve: false,
      category: "Salad",
      size: "Phần",
      kitchen: "Thực dưỡng",
      cuisine: "Chay",
      description: "Salad tươi ngon với rau củ hữu cơ.",
      ingredients: ["Rau xà lách", "Cà chua", "Dưa chuột", "Dầu ô liu"],
      calories: 150,
      protein: 3,
      carbs: 10,
      fat: 7,
    },
    {
      name: "Súp bí đỏ",
      price: 7.50,
      images: ["url_to_image2"],
      isFeature: false,
      isArchieve: false,
      category: "Súp",
      size: "Phần",
      kitchen: "Thực dưỡng",
      cuisine: "Chay",
      description: "Súp bí đỏ thơm ngon, bổ dưỡng.",
      ingredients: ["Bí đỏ", "Hành tây", "Nước dùng", "Gia vị"],
      calories: 200,
      protein: 4,
      carbs: 30,
      fat: 5,
    },
    {
      name: "Cơm gạo lứt",
      price: 5.00,
      images: ["url_to_image3"],
      isFeature: false,
      isArchieve: false,
      category: "Cơm",
      size: "Phần",
      kitchen: "Thực dưỡng",
      cuisine: "Chay",
      description: "Cơm gạo lứt giàu dinh dưỡng.",
      ingredients: ["Gạo lứt", "Nước"],
      calories: 250,
      protein: 6,
      carbs: 52,
      fat: 2,
    },
    {
      name: "Đậu hũ xào rau củ",
      price: 9.00,
      images: ["url_to_image4"],
      isFeature: true,
      isArchieve: false,
      category: "Món chính",
      size: "Phần",
      kitchen: "Thực dưỡng",
      cuisine: "Chay",
      description: "Đậu hũ xào với rau củ tươi ngon.",
      ingredients: ["Đậu hũ", "Cà rốt", "Bông cải xanh", "Nước tương"],
      calories: 300,
      protein: 15,
      carbs: 20,
      fat: 10,
    },
    {
      name: "Mì quinoa",
      price: 10.50,
      images: ["url_to_image5"],
      isFeature: false,
      isArchieve: false,
      category: "Món chính",
      size: "Phần",
      kitchen: "Thực dưỡng",
      cuisine: "Chay",
      description: "Mì quinoa với rau củ và nước sốt nhẹ.",
      ingredients: ["Mì quinoa", "Rau củ", "Nước sốt"],
      calories: 350,
      protein: 12,
      carbs: 60,
      fat: 5,
    },
    {
      name: "Cháo yến mạch",
      price: 6.50,
      images: ["url_to_image6"],
      isFeature: false,
      isArchieve: false,
      category: "Cháo",
      size: "Phần",
      kitchen: "Thực dưỡng",
      cuisine: "Chay",
      description: "Cháo yến mạch bổ dưỡng, dễ tiêu hóa.",
      ingredients: ["Yến mạch", "Nước", "Trái cây"],
      calories: 200,
      protein: 5,
      carbs: 40,
      fat: 3,
    },
    {
      name: "Nước ép xanh",
      price: 4.50,
      images: ["url_to_image7"],
      isFeature: true,
      isArchieve: false,
      category: "Nước uống",
      size: "Ly",
      kitchen: "Thực dưỡng",
      cuisine: "Chay",
      description: "Nước ép từ rau xanh và trái cây.",
      ingredients: ["Cải xoăn", "Táo", "Chanh"],
      calories: 100,
      protein: 2,
      carbs: 25,
      fat: 0,
    },
    {
      name: "Bánh mì nguyên cám",
      price: 3.00,
      images: ["url_to_image8"],
      isFeature: false,
      isArchieve: false,
      category: "Bánh",
      size: "Miếng",
      kitchen: "Thực dưỡng",
      cuisine: "Chay",
      description: "Bánh mì nguyên cám, tốt cho sức khỏe.",
      ingredients: ["Bột nguyên cám", "Nước", "Men"],
      calories: 150,
      protein: 5,
      carbs: 30,
      fat: 1,
    },
    {
      name: "Trà thảo mộc",
      price: 2.50,
      images: ["url_to_image9"],
      isFeature: false,
      isArchieve: false,
      category: "Nước uống",
      size: "Ly",
      kitchen: "Thực dưỡng",
      cuisine: "Chay",
      description: "Trà thảo mộc tự nhiên, thanh mát.",
      ingredients: ["Trà xanh", "Gừng", "Chanh"],
      calories: 50,
      protein: 0,
      carbs: 10,
      fat: 0,
    },
    {
      name: "Bánh ngô hấp",
      price: 5.50,
      images: ["url_to_image10"],
      isFeature: false,
      isArchieve: false,
      category: "Bánh",
      size: "Miếng",
      kitchen: "Thực dưỡng",
      cuisine: "Chay",
      description: "Bánh ngô hấp mềm mịn, thơm ngon.",
      ingredients: ["Ngô", "Bột gạo", "Nước"],
      calories: 200,
      protein: 4,
      carbs: 40,
      fat: 2,
    },
    {
      name: "Chè đậu xanh",
      price: 4.00,
      images: ["url_to_image11"],
      isFeature: false,
      isArchieve: false,
      category: "Tráng miệng",
      size: "Phần",
      kitchen: "Thực dưỡng",
      cuisine: "Chay",
      description: "Chè đậu xanh ngọt nhẹ, bổ dưỡng.",
      ingredients: ["Đậu xanh", "Nước", "Đường"],
      calories: 180,
      protein: 6,
      carbs: 30,
      fat: 1,
    },
    {
      name: "Nấm xào tỏi",
      price: 9.50,
      images: ["url_to_image12"],
      isFeature: true,
      isArchieve: false,
      category: "Món chính",
      size: "Phần",
      kitchen: "Thực dưỡng",
      cuisine: "Chay",
      description: "Nấm xào tỏi thơm ngon, bổ dưỡng.",
      ingredients: ["Nấm", "Tỏi", "Dầu ô liu"],
      calories: 250,
      protein: 8,
      carbs: 15,
      fat: 12,
    },
    {
      name: "Bánh pudding hạt chia",
      price: 5.00,
      images: ["url_to_image13"],
      isFeature: false,
      isArchieve: false,
      category: "Tráng miệng",
      size: "Phần",
      kitchen: "Thực dưỡng",
      cuisine: "Chay",
      description: "Bánh pudding hạt chia ngọt tự nhiên.",
      ingredients: ["Hạt chia", "Sữa hạnh nhân", "Mật ong"],
      calories: 150,
      protein: 4,
      carbs: 20,
      fat: 5,
    },
    {
      name: "Mì gạo lứt",
      price: 8.00,
      images: ["url_to_image14"],
      isFeature: false,
      isArchieve: false,
      category: "Món chính",
      size: "Phần",
      kitchen: "Thực dưỡng",
      cuisine: "Chay",
      description: "Mì gạo lứt với nước sốt nhẹ.",
      ingredients: ["Mì gạo lứt", "Nước sốt", "Rau củ"],
      calories: 300,
      protein: 10,
      carbs: 60,
      fat: 3,
    },
    {
      name: "Nước dừa tươi",
      price: 3.50,
      images: ["url_to_image15"],
      isFeature: false,
      isArchieve: false,
      category: "Nước uống",
      size: "Ly",
      kitchen: "Thực dưỡng",
      cuisine: "Chay",
      description: "Nước dừa tươi mát lạnh.",
      ingredients: ["Nước dừa"],
      calories: 60,
      protein: 1,
      carbs: 15,
      fat: 0,
    },
    {
      name: "Bánh tráng cuốn",
      price: 7.00,
      images: ["url_to_image16"],
      isFeature: false,
      isArchieve: false,
      category: "Món chính",
      size: "Phần",
      kitchen: "Thực dưỡng",
      cuisine: "Chay",
      description: "Bánh tráng cuốn rau củ tươi ngon.",
      ingredients: ["Bánh tráng", "Rau củ", "Nước chấm"],
      calories: 200,
      protein: 5,
      carbs: 30,
      fat: 2,
    },
    {
      name: "Sữa hạt điều",
      price: 4.00,
      images: ["url_to_image17"],
      isFeature: false,
      isArchieve: false,
      category: "Nước uống",
      size: "Ly",
      kitchen: "Thực dưỡng",
      cuisine: "Chay",
      description: "Sữa hạt điều tự nhiên, bổ dưỡng.",
      ingredients: ["Hạt điều", "Nước", "Đường"],
      calories: 120,
      protein: 3,
      carbs: 15,
      fat: 6,
    },
    {
      name: "Chả giò chay",
      price: 8.50,
      images: ["url_to_image18"],
      isFeature: true,
      isArchieve: false,
      category: "Món chính",
      size: "Phần",
      kitchen: "Thực dưỡng",
      cuisine: "Chay",
      description: "Chả giò chay giòn rụm, thơm ngon.",
      ingredients: ["Bánh tráng", "Rau củ", "Nước chấm"],
      calories: 250,
      protein: 6,
      carbs: 30,
      fat: 10,
    },
    {
      name: "Nước ép cà rốt",
      price: 3.00,
      images: ["url_to_image19"],
      isFeature: false,
      isArchieve: false,
      category: "Nước uống",
      size: "Ly",
      kitchen: "Thực dưỡng",
      cuisine: "Chay",
      description: "Nước ép cà rốt tươi ngon, bổ dưỡng.",
      ingredients: ["Cà rốt", "Chanh"],
      calories: 80,
      protein: 1,
      carbs: 20,
      fat: 0,
    },
    {
      name: "Bánh mì chay",
      price: 4.50,
      images: ["url_to_image20"],
      isFeature: false,
      isArchieve: false,
      category: "Bánh",
      size: "Miếng",
      kitchen: "Thực dưỡng",
      cuisine: "Chay",
      description: "Bánh mì chay với nhân rau củ.",
      ingredients: ["Bánh mì", "Rau củ", "Gia vị"],
      calories: 200,
      protein: 5,
      carbs: 35,
      fat: 3,
    },
  ];

  async function addMenuToFirestore() {
    const storeId = 'T5efehVuTKiOIPOhWgjq'
    for (const menuItem of sampleMenu) {
      try {
        const response = await axios.post(`http://localhost:3001/api/${storeId}/products`, menuItem, {

        });

        console.log("Thực đơn đã được thêm:", response.data);
      } catch (error) {
        console.error("Lỗi khi thêm thực đơn:", error.response ? error.response.data : error.message);
      }
    }
  }

  // Gọi hàm với storeId của bạn
  addMenuToFirestore();
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
      console.error("Error during submission:", error);
      toast.error("Something went wrong");
    } finally {
      console.log("Form submission complete");
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
      toast.error("Something went wrong" + error);
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
                  <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
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
                  <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
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
                  <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
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
            {/* Description */}
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input disabled={isLoading} placeholder="Product description..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Ingredients */}
            <FormField control={form.control} name="ingredients" render={({ field }) => (
              <FormItem>
                <FormLabel>Ingredients</FormLabel>
                <FormControl>
                  <Input disabled={isLoading} placeholder="List ingredients..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Calories */}
            <FormField control={form.control} name="calories" render={({ field }) => (
              <FormItem>
                <FormLabel>Calories</FormLabel>
                <FormControl>
                  <Input disabled={isLoading} placeholder="Calories" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="protein" render={({ field }) => (
              <FormItem>
                <FormLabel>Protein (g)</FormLabel>
                <FormControl>
                  <Input disabled={isLoading} placeholder="Protein" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="carbs" render={({ field }) => (
              <FormItem>
                <FormLabel>Carbs (g)</FormLabel>
                <FormControl>
                  <Input disabled={isLoading} placeholder="Carbs" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="fat" render={({ field }) => (
              <FormItem>
                <FormLabel>Fat (g)</FormLabel>
                <FormControl>
                  <Input disabled={isLoading} placeholder="Fat" type="number" {...field} />
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
