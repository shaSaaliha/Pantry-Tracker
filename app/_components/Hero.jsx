import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import { useUser, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { firestore } from '@/firebase'
import { collection, getDocs, query } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

function Hero() {
  const { user, isSignedIn } = useUser();
  const [isEmpty, setIsEmpty] = useState(true)
  const router = useRouter();

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    if (docs.empty) {
      setIsEmpty(true)
      //router.replace('/dashboard/tracker')
    } else {
      setIsEmpty(false)
      //router.replace('/dashboard')
    }
  }
  useEffect(() => {
    updateInventory()
  }, [])
  return (
    <section className="relative bg-[url(https://images.unsplash.com/photo-1582840803949-474387fd70a3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cGFudHJ5fGVufDB8fDB8fHww)] bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-0 bg-black/45 backdrop-blur-sm"></div> {/* This adds the blur effect */}
      <div className="absolute top-4 right-6">
        {isSignedIn && <UserButton />}
      </div>
      <div className="relative mx-auto max-w-screen-xl min-h-screen px-4 py-40 lg:flex">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-3xl text-white font-extrabold sm:text-5xl">
            Track Your Pantry.
            <strong className="font-extrabold text-green-600 sm:block"> Save Your Time </strong>
          </h1>

          <p className="mt-4 text-white sm:text-xl/relaxed">
            Start adding your products and manage them effeciently
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/sign-in" className="block w-full rounded bg-green-600 px-12 py-3 text-sm font-medium text-white shadow hover:bg-green-700 focus:outline-none focus:ring active:bg-green-700 sm:w-auto">
              Get Started
            </Link>
            <Link href="/sign-in" className="block w-full rounded bg-white px-12 py-3 text-sm font-medium text-black shadow hover:bg-blue-400 focus:outline-none focus:ring sm:w-auto">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero