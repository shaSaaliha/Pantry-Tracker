import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useUser, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

function Header() {
  const {user, isSignedIn} = useUser();
  return (
    <div className='p-5 flex justify-between items-center border shadow-sm'>
        <Image src={'./logo.svg'}
        alt='logo'
        width={30}
        height={40}
        />
      <div className='flex gap-2'>
        {isSignedIn?
          <Link href = {'/dashboard'}>
            <Button className='bg-slate-200 text-black hover:bg-slate-300'>Dashboard</Button>
          </Link>
          :
          <Link href = {'/sign-in'}>
            <Button className='bg-slate-200 text-black hover:bg-slate-300'>Dashboard</Button>
          </Link>
        }
        {isSignedIn?
          <UserButton/> :
          <Link href = {'/sign-in'}>
            <Button className="bg-green-600 text-white shadow hover:bg-green-700 focus:outline-none focus:ring active:bg-green-700 sm:w-auto"
            >Get Started</Button>
          </Link>
        }
      </div>
    </div>
  )
}

export default Header