"use client"
import { storage } from "@/lib/firebase"
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { ImagePlus, Trash2, X } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { PuffLoader } from 'react-spinners'
import { Button } from "./button"

interface ImagesUploadsProps {
  disable?: boolean,
  onChange: (urls: string[]) => void,
  onRemove: (value: string) => void,
  value: string[]
}

export const ImagesUpload = ({ disable, onChange, onRemove, value }: ImagesUploadsProps) => {
  const [isMounted, setIsMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState<number>(0)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files: File[] = Array.from(e.target.files); 
    setIsLoading(true);

    try {
      const uploadedUrls = await Promise.all(
        files.map(async (file) => {
          const storageRef = ref(storage, `Images/Products/${Date.now()}-${file.name}`);
          const uploadTask = uploadBytesResumable(storageRef, file);

          return new Promise<string>((resolve, reject) => {
            uploadTask.on(
              'state_changed',
              (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(progress);
              },
              (error) => {
                toast.error('Failed to upload file.');
                reject(error);
              },
              async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(downloadURL);
              }
            );
          });
        })
      );

      onChange([...value, ...uploadedUrls]);
      setIsLoading(false);
      setProgress(0);
    } catch (error) {
      console.error('Error uploading files: ', error);
      setIsLoading(false);
    }
  };

  const onDelete = async (url: string) => {
    const newValue = value.filter((imageUrl => imageUrl !== url ))
    try {   
      onRemove(url); 
      await deleteObject(ref(storage,url)); 
      onChange(newValue)
      toast.success('Images deleted successfully');
    } catch (error) {
      toast.error('Failed to delete images');
      console.error('Error deleting file:', error);
    }
  };

  return (
    <div>
      {value && value.length > 0 ? (
        <>
          <div className="mb-4 flex items-center gap-4">
            {value.map((url) => (
              <div
                className="relative w-52 h-52 rounded-md overflow-hidden"
                key={url}
              >
                <Image
                  fill
                  className="object-cover"
                  alt="Uploaded image"
                  src={url}
                />
                <div className="absolute z-10 top-2 right-2">
                  <Button variant={"destructive"} size={"icon"} type="button"
                    onClick={() => onDelete(url)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="w-52 h-52 rounded-md overflow-hidden border border-dashed border-gray-200
          flex items-center justify-center flex-col gap-3">
          {isLoading ?
            <>
              <PuffLoader size={30} color="#555" />
              <p>{`${progress.toFixed(2)}%`}</p>
            </>
            : <>
              <label>
                <div className="w-full h-full flex flex-col gap-2 items-center justify-center cursor-pointer">
                  <ImagePlus className="w-4 h-4" />
                  <p>Upload product images</p>
                </div>
                <input
                  type="file"
                  onChange={onUpload}
                  accept="image/*"
                  className="w-0 h-0"
                  multiple
                />
              </label>
            </>}
        </div>
      )}
    </div>
  )
}
