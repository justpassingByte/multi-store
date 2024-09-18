import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { KitchensColumn } from "./column";
import { Button } from "@/components/ui/button";
import { Copy, MoreVertical, RefreshCw, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modal/alert-modal";
import toast from "react-hot-toast";

import axios from "axios";

import { useState } from "react";

interface CellActionProps{
    data: KitchensColumn
}
export const CellAction =({data}: CellActionProps) =>{
    const [isLoading, setIsLoading] = useState(false)
    const params = useParams()
    const router = useRouter()
    const [open, setOpen] = useState(false)

    const onDelete = async () => {
      console.log("Size data:", data);
      
      try {
          setIsLoading(true);

          // Log the API call to delete the categories in Firestore
          console.log(`Attempting to delete from Firestore: /api/${params.storeId}/kitchens/${data.id}`);
          
          await axios.delete(`/api/${params.storeId}/kitchens/${data.id}`);

          console.log("Firestore document deleted successfully");

          toast.success("Kitchen removed");
          location.reload()
          // Redirect after deletion
          router.push(`/${params.storeId}/kitchens`);
      } catch (error) {
          console.error("Error during deletion:", error);
          toast.error("Something went wrong"+ error);
      } finally {
          setIsLoading(false);
          setOpen(false);
      }
  };
    const onCopy = () =>{
    navigator.clipboard.writeText(data.name)
    toast.success("Size name copied to clipboard")
  }
    return (
        <div>
             <AlertModal
                isOpen={open} onClose={() => setOpen(false)}
                onConfirm={onDelete} loading={isLoading}               
            />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onCopy()}
            >
              <Copy className="mr-2 h-4 w-4" />
              <span>Copy ID</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={()=> router.push(`/${params.storeId}/kitchens/${data.id}`)}>
              <RefreshCw className="mr-2 h-4 w-4" />
              <span>Update</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
                onClick={()=> setOpen(true)}
            className="text-red-600">
              <Trash className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
      )
}