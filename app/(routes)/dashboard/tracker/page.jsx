import React from 'react'
import PantryList from './_components/PantryList'
import { ArrowLeft } from 'lucide-react'

function Tracker() {
  return (
    <div className='p-10'>
        <h2 className="font-bold text-2xl">My Pantry List🌽🥩🥢</h2>
        <p className='text-gray-500'>Start adding items within each category!</p>
        <PantryList/>
    </div>
  )
}

export default Tracker