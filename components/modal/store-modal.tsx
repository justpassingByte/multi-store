"use client"
import { useStoreModal } from '@/app/hooks/use-store-modal'
import {Modal} from '@/components/modal'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {z} from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import toast from 'react-hot-toast'
import {  useRouter } from 'next/navigation'
const formSchema = z.object({
    name: z.string().min(3,{message:"Store name should be minimum 3 characters"})
})

export const StoreModal =()=>{
    const [isLoading,setIsLoading] = useState(false)
    const storeModal = useStoreModal()
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver : zodResolver(formSchema),
        defaultValues: {
            name: ""
        }
    })
    const onSubmit = async(values: z.infer<typeof formSchema>) =>{
        console.log(values);
        try {
            setIsLoading(true)
            const res = await axios.post('/api/stores',values)
          
            toast.success("Store created")
           
            storeModal.onClose()
            router.push(`/${res.data.id}`)
        } catch (error) {
            console.log(error);
            toast.error("Some thing went wrong")
        }finally{
            setIsLoading(false)
        }
    }
    return(
        <Modal title="Create a new store" description='Add a new store to manage the products and categories' 
        isOpen={storeModal.isOpen}
        onClose={storeModal.onClose}>
           
           <div className='space-y-4 py-2 pb-4'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField control={form.control} name='name' render={({field}) =>(
                            <FormItem>
                                <FormLabel> Name</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isLoading}
                                        placeholder='Your store name...'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>

                        )}/>
                        <div className='pt-6 space-x-2 flex items-center justify-end w-full'>
                            <Button type='button' variant={"outline"} size={"sm"} onClick={storeModal.onClose}>Cancel</Button>
                            <Button disabled={isLoading} type='submit' size={"sm"}>Continue</Button>
                        </div>
                    </form>
                </Form>
           </div>
        </Modal>
    )
}