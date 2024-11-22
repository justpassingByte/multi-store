"use client"
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import React from 'react'
export const MainNav = ({className, ... props}: React.HtmlHTMLAttributes<HTMLElement>) => {
    const pathName = usePathname()
    const params = useParams()

    const routes = [
        {
            href:`/${params.storeId}`,
            label:"Overview",
            active: pathName ===`/${params.storeId}`
        },             
        // {
        //     href:`/${params.storeId}/billboards`,
        //     label:"BillBoards",
        //     active: pathName ===`/${params.storeId}/billboards`
        // },
        {
            href:`/${params.storeId}/categories`,
            label:"Categories",
            active: pathName ===`/${params.storeId}/categories`
        },
        {
            href:`/${params.storeId}/sizes`,
            label:"Sizes",
            active: pathName ===`/${params.storeId}/sizes`
        },
        {
            href:`/${params.storeId}/kitchens`,
            label:"Kitchens",
            active: pathName ===`/${params.storeId}/kitchens`
        },
        {
            href:`/${params.storeId}/cuisines`,
            label:"Cuisines",
            active: pathName ===`/${params.storeId}/cuisines`
        },
        {
            href:`/${params.storeId}/products`,
            label:"Products",
            active: pathName ===`/${params.storeId}/products`
        },
        {
            href:`/${params.storeId}/combos`,
            label:"Combos",
            active: pathName ===`/${params.storeId}/combos`
        },
        {
            href:`/${params.storeId}/orders`,
            label:"Orders",
            active: pathName ===`/${params.storeId}/orders`
        },
        {
            href:`/${params.storeId}/settings`,
            label:"Settings",
            active: pathName ===`/${params.storeId}/settings`
        },   
    ]
    return (
        <nav className={cn("flex items-center space-x-4 lg:space-x-6 pl-6", className)} {...props}>
            {routes.map(route => (
                <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                        "text-sm font-medium transition-colors hover:text-primary",
                        route.active ? "text-black dark:text-white" : "text-muted-foreground"
                    )}
                >
                    {route.label}
                </Link>
            ))}
        </nav>
    )
}


