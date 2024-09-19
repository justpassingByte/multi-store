"use client"


import { useOrigin } from "@/app/hooks/use-origin"
import { AlertModal } from "@/components/modal/alert-modal"
import ApiAlert from "@/components/ui/api-alert"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import Heading from "@/components/ui/heading"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Store } from "@/type-db"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { Trash } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"

interface SettingFormProps {
    initialData: Store
}
const formSchema = z.object({
    name: z.string().min(3, { message: "Store must be at least 3 characters" })
})
const SettingForm = ({ initialData }: SettingFormProps) => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData.name,
        }

    })
    const [isLoading, setIsLoading] = useState(false)
    const params = useParams()
    const router = useRouter()
    const [open,setOpen] = useState(false) 
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        console.log("Form data:", data); 
      
        try {
            setIsLoading(true)
            const res = await axios.patch(`/api/stores/${params.storeId}`,data)
            console.log("API Response:", res); 
            toast.success("Store updated")
            router.refresh()
        } catch (error) {
            console.log("Error:", error); 
            toast.error("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }
    const onDelete = async () => {     
        try {
            setIsLoading(true)
             await axios.delete(`/api/${params.storeId}`)          
            toast.success("Store removed")
            router.refresh()
            router.push('/')
        } catch (error) {
           
            toast.error("Something went wrong")
        } finally {
            setIsLoading(false)
            setOpen(false)
        }
    }
    const origin = useOrigin()
    return (
        <>
        <AlertModal 
            isOpen={open} onClose={()=> setOpen(false)}
            onConfirm={onDelete} loading = {isLoading}
            />
            <div className="flex items-center justify-center">
                <Heading title="Setting" description="Manage Store reference" />
                <Button variant={"destructive"} size={"icon"} onClick={() => setOpen(true)}>
                    <Trash className="w-4 h-4" />
                </Button>
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
                    <div className="gird grid-cols-3 gap8">
                        <FormField control={form.control} name='name' render={({ field }) => (
                            <FormItem>
                                <FormLabel> Name</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isLoading}
                                        placeholder={'Your store name...'}
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
            <Separator/>
            <ApiAlert title="NEXT_PUBLIC_API_URL" description={`${origin}/api/${params.storeId}`} variant="public"/>
        </>
    )
}

export default SettingForm
