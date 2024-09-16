"use client"

import { storage } from "@/lib/firebase"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { ImagePlus } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import {PuffLoader} from 'react-spinners'
interface ImageUploadsProps{
    disable? : boolean,
    onChange : (value: string) => void,
    onRemove : (value: string) => void,
    value: string[]
}

export const ImageUpload =({disable, onChange, onRemove, value}: ImageUploadsProps) =>{
    const [isMounted, setIsMounted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [progress, setProgress] = useState<number>(0)

    useEffect(()=>{
        setIsMounted(true)
    },[])
    if(!isMounted){
        return null
    }

    const onUpload = async (e:any) =>{
        const file = e.target.files[0]     
        setIsLoading(true)
        const uploadTask = uploadBytesResumable(ref(storage,`Images/${Date.now()}-${file.name}`), file,
        {contentType: file.type})
        uploadTask.on("state_changed",
             (snapshot)=>{
                setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
             },
             (error)=>{
                toast.error(error.message)
             },
             ()=>{
                getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) =>{
                    onChange(downloadUrl)
                    setIsLoading(false)
                })
             }
            )
    } 
       
    return (
    <div>
        {value && value.length > 0 ? 
        (<>
            <div className="mb-4 flex items-center gap-4">
                {value.map((url)=>(
                    <div
                    className="relative w-52 h-52 rounded-md overflow-hidden"
                    key={url}
                    >
                        <Image
                            fill
                            className="object-cover"
                            alt="Billboard img"
                            src={url}
                        />
                    </div>
                ))}
            </div>
        </>)
         : (
            <div className="w-52 h-52 rounded-md overflow-hidden border border-dashed border-gray-200
            flex items-center justify-center flex-col gap-3">
                {isLoading? 
                <>
                <PuffLoader size={30} color="#555"/>
                <p>{`${progress.toFixed(2)}%`}</p>
                </> 
                : <>
                    <label>
                        <div className="w-full h-full flex flex-col gap-2 items-center justify-center cursor-pointer">
                        <ImagePlus className="w-4 h-4"/>
                        <p>Upload an image</p>

                        </div>
                        <input type="file" 
                        onChange={onUpload} 
                        accept="image/*" className="w-0 h-0"></input>
                    </label>
                </>}
            </div>
        )}
    </div>

    )
}