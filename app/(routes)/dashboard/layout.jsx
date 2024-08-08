"use client"
import React from 'react'
import SideNav from './_components/SideNav'
import DashboardHeader from './_components/DashboardHeader'
import { useState, useEffect } from "react";
import {firestore} from '@/firebase'
import { collection, deleteDoc, doc, getDocs, query, getDoc, setDoc} from "firebase/firestore";
import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

function DashboardLayout({children}) {
    const [inventory, setInventory] = useState([])
    const router = useRouter();
      
    const updateInventory = async () => {
      const snapshot = query(collection(firestore, 'inventory'))
      const docs  = await getDocs(snapshot)
      const inventoryList = []
      if (docs.empty) {
        router.replace('/dashboard/tracker')
      } else {
        
        docs.forEach((doc)=>{
            inventoryList.push({
            name: doc.id,
            ...doc.data(),
            })
      })}
      setInventory(inventoryList)
      console.log(inventoryList)
    }
  
  return (
    <div>
        <div className='fixed md:w-64 hidden md:block'>
            <SideNav/>
        </div>
        <div className='md:ml-64'>
            {/*<DashboardHeader/>*/}
            {children}
        </div>
    </div>
    
  )
}

export default DashboardLayout