'use client'
import { UserButton } from '@clerk/nextjs'
import { Layers3, LayoutGrid, SquareMenu, SquareStack, Utensils } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'

function SideNav() {
    const menuList = [
        {
            id:1,
            name: 'Dashboard',
            icon:LayoutGrid,
            path:'/dashboard'
        },
        {
            id:2,
            name: 'Tracker',
            icon:SquareStack,
            path:'/dashboard/tracker'

        },
        {
            id:3,
            name: 'Items',
            icon:SquareMenu,
            path:'/dashboard/items'
        },
        
    ]
    const path = usePathname();

    useEffect(()=>{
        console.log(path)
    }, [path])
    
  return (
    <div className='h-screen p-5 border shadow-sm w-120'>
        <Image src={'/logo.svg'}
        alt='logo'
        width={30}
        height={40}
        />
        <div className='mt-7'>
            {menuList.map((menu, index) => (
                <Link href={menu.path}>
                    <h2 className={`flex gap-2 items-center text-gray-500 font-medium
                        mb-3 p-6 cursor pointer rounded-md
                        hover:text-primary hover:bg-green-100
                        ${path==menu.path&& 'text-primary bg-green-100'}
                        `}>
                        <menu.icon/>
                        {menu.name}
                    </h2>
                </Link>
            ))} 
        </div>
            <div className='fixed bottom-6 p-5 flex gap-2 items-center'>
                <UserButton/>
                Profile
            </div>
    </div>
  )
}

export default SideNav