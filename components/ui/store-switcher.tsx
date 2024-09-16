"use client"
import React, { useEffect, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Store } from '@/type-db'
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Button } from './button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './command';
import { cn } from '@/lib/utils';
import { ChevronDownIcon, ChevronUpIcon, CheckIcon } from '@heroicons/react/20/solid'; // Import CheckIcon
import {
    StoreIcon
} from "lucide-react"
import { CommandSeparator } from 'cmdk';
import { useStoreModal } from '@/app/hooks/use-store-modal';
import CreateNewStoreItem from './create-new-store-item';

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>;

interface StoreSwitcherProps extends PopoverTriggerProps {
    items: Store[]
}

export const StoreSwitcher = ({ items }: StoreSwitcherProps) => {
    const params = useParams()
    const router = useRouter()
    const [formattedStores, setFormattedStores] = useState(() =>
        items.map(item => ({
            label: item.name,
            value: item.id
        }))
    )
    const [currentStore, setCurrentStore] = useState(() =>
        formattedStores.find(item => item.value === params.storeId) || null
    )
    const [open, setOpen] = useState(false)
    const storeModal = useStoreModal()


    // Update formattedStores and currentStore when items change
    useEffect(() => {
        const updatedStores = items.map(item => ({
            label: item.name,
            value: item.id
        }));
        setFormattedStores(updatedStores);
    }, [items, params.storeId])

    const onStoreSelect = (store: { value: string, label: string }) => {
        setCurrentStore(store)  
        setOpen(false)
        router.push(`/${store.value}`) 
        router.refresh()
    }
 
    return (
        <div className="flex items-center space-x-4">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-[200px] justify-start flex items-center"
                    >
                        <StoreIcon className="mr-2 h-4 w-4" />
                        {currentStore?.value
                            ? formattedStores.find((framework) => framework.value === currentStore.value)?.label
                            : "Select Store..."
                        }
                        {open ? (
                            <ChevronUpIcon className="h-5 w-5 ml-auto" aria-hidden="true" />
                        ) : (
                            <ChevronDownIcon className="h-5 w-5 ml-auto" aria-hidden="true" />
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" side="bottom" align="start">
                    <Command>
                        <CommandInput placeholder="Change stores..." />
                        <CommandList>
                            <CommandEmpty>No stores found.</CommandEmpty>
                            <CommandGroup>
                                {formattedStores.map((store) => (
                                    <CommandItem
                                        key={store.value}
                                        value={store.value}
                                        onSelect={() => onStoreSelect(store)}
                                    >
                                        <span className="flex items-center">
                                            <CheckIcon
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    currentStore?.value === store.value
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                )}
                                                aria-hidden="true"
                                            />
                                            {store.label}
                                        </span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                        <CommandSeparator />
                        <CommandList>
                            <CommandGroup>
                                <CreateNewStoreItem
                                    onClick={async () => {
                                        setOpen(false)
                                        storeModal.onOpen()
                                    }}
                                />
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}
