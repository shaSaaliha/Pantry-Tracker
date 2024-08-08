import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

function CategoryItem({ category, subItemCount, icon }) {
    const router = useRouter();

    const handleClick = () => {
      router.push(`/dashboard/items/${category}`);
    };

  return (
    <div className='p-5 border rounded-lg hover:shadow-md cursor-pointer h-[100px]'
        onClick={handleClick}>
        <div className='flex gap-2 items-center justify-between'>
            <div className='flex gap-2 items-center'>
                <h2 className='text-2xl p-3 px-3 bg-slate-100 rounded-full'>{icon}</h2>
                <div>
                    <h2 className="font-bold text-green-600 text-medium">{category}</h2>
                </div>
            </div>
            <h2>{subItemCount} Item{(subItemCount > 1) ? 's' : ''}</h2>
        </div>
    </div>
  )
}

export default CategoryItem