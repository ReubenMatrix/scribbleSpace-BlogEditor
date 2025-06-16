"use client"


import { UserButton } from '@clerk/nextjs'
import { BellIcon, Home, PenTool, Plus, Search } from 'lucide-react'
import React from 'react'
import { useRouter } from 'next/navigation'



function Sidebar() {

    const router = useRouter();
    
    return (
        <div className='h-full'>
            <div className='flex flex-col items-center justify-between p-2 border-2 border-black h-full rounded-md space-y-4'>
                <div className='rounded-md p-2 border-1 border-gray-200'>
                    <PenTool />
                </div>

                <div className='flex flex-col items-center justify-between space-y-5'>
                    <div className='rounded-md p-2 border-1 border-gray-200'>
                        <Home />
                    </div>

                    <div className='rounded-md p-2 border-1 border-gray-200'>
                        <Search />
                    </div>

                    <div className='rounded-md p-2 border-1 border-gray-200'>
                        <BellIcon />
                    </div>

                    <div className='border-2 border-black rounded-md flex items-center justify-center' 
                        onClick={() => router.push('/post/123')}>
                        <Plus />

                    </div>

                </div>

                <div>
                    <UserButton />
                </div>
            </div>
        </div>
    )
}

export default Sidebar
