"use client"
import React, { useEffect, useState } from 'react'
import CreateList from './CreateList'
import {firestore} from '@/firebase'
import { collection, deleteDoc, doc, getDocs, query, getDoc, setDoc} from "firebase/firestore";
import CategoryItem from './CategoryItem';

function PantryList() {

  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  /**
   * Using updateInventory here to get the category, icon, and number of sub-tems information
   */
  const getInventoryList = async () => {
      setIsLoading(true)
      const snapshot = query(collection(firestore, 'inventory'));
      const docs = await getDocs(snapshot);
      const inventoryList = [];

        if (!docs.empty) {
            for (const document of docs.docs) {
                const subCollectionSnapshot = await getDocs(collection(firestore, 'inventory', document.id, 'items'));
                const subItemCount = subCollectionSnapshot.size; // Get the count of sub-items

                const data = document.data();
                inventoryList.push({
                    name: document.id,
                    subItemCount: subItemCount,
                    //createdAt: serverTimestamp(),
                    createdAt: data.createdAt ? data.createdAt.toDate() : new Date(0),
                    icon: data.icon || '🧺', // Use the saved icon or a default one
                    ...data,
                });
            }
        }
        inventoryList.sort((a, b) => b.createdAt - a.createdAt);
        setInventory(inventoryList);
        setIsLoading(false)
    };

  useEffect(() => {
    getInventoryList()
  }, [])

  return (
    <div className='mt-7'>
        <div className='grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
            <CreateList
            refreshData={() => getInventoryList()}/>
        {/**
         * Array(inventory.length) creates a new array with a length equal to the number of items in the inventory.
         *.fill() fills this array with undefined values. This is needed because an empty array without filled values won't work with .map().
         */}
        {isLoading ? (
          Array(inventory.length).fill().map((_, index) => (
            <div key={index} className='w-full bg-slate-200 rounded-lg h-[100px] animate-pulse'></div>
          ))
        ) : (
          inventory.map((doc) => (
            <CategoryItem
              key={doc.name}
              category={doc.name}
              subItemCount={doc.subItemCount}
              icon={doc.icon}
            />
          ))
        )}
        </div>
    </div>

  )
}

export default PantryList