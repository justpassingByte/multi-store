"use client"


import { useOrigin } from "@/app/hooks/use-origin"
import { AlertModal } from "@/components/modal/alert-modal"
import ApiAlert from "@/components/ui/api-alert"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import Heading from "@/components/ui/heading"
import { ImageUpload } from "@/components/ui/image-upload"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { storage } from "@/lib/firebase"
import { Billboards } from "@/type-db"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { deleteObject, ref } from "firebase/storage"
import { Trash } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"

interface BillboardFormProps {
    initialData: Billboards
}
const formSchema = z.object({
    label: z.string().min(1),
    imageUrl: z.string().min(1)
})
const BillboardForm = ({ initialData }: BillboardFormProps) => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData


    })
    const [isLoading, setIsLoading] = useState(false)
    const params = useParams()
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const origin = useOrigin()
    const title = initialData ? "Edit Bill board" : "Create Bill board"
    const description = initialData ? "Edit a Bill board" : "Add a new Bill board"
    const toastMessage = initialData ? "Bill board updated" : "Bill board created"
    const action = initialData ? "Save Changes" : "Create Bill board"

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        console.log("Form data:", data);

        try {
            if(initialData){
                await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data)
                toast.success("Bill board updated")
                router.push(`/${params.storeId}/billboards`)
            }else{
                setIsLoading(true)
                await axios.post(`/api/${params.storeId}/billboards`, data)
                toast.success("Bill board created")
                router.push(`/${params.storeId}/billboards`)
            }
            
        } catch (error) {
            console.log("Error:", error);
            toast.error("Something went wrong")
        } finally {
            router.refresh()
            setIsLoading(false)
        }
    }
    
   
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
                            <FormLabel> Billboard Image</FormLabel>
                            <FormControl>
                                <ImageUpload value={field.value? [field.value] : []} 
                                disable={isLoading}
                                 onChange ={(url) => field.onChange(url)} 
                                 onRemove={()=>field.onChange("")}/>
                            </FormControl>
                        </FormItem>
                        )}/>
                    <div className="gird grid-cols-3 gap-8">
                        <FormField control={form.control} name='label' render={({ field }) => (
                            <FormItem>
                                <FormLabel> Name</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isLoading}
                                        placeholder={'Your Billboard name...'}
                                        {...field}
                        
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>

                        )} />
                    </div>
                    <Button disabled={isLoading} type='submit' size={"sm"}>Save Changes</Button>
                </form>
            </Form>
            <Separator />
            <ApiAlert title="NEXT_PUBLIC_API_URL" description={`${origin}/api/${params.billboardId}`} variant="public" />
        </>
    )
}

export default BillboardForm
