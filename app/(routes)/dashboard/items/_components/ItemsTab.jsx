"use client"
import { UserButton, useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
import ItemListTable from './ItemListTable';
import {firestore} from '@/firebase'
import SearchBar from './SearchBar'; 
import { collection, deleteDoc, doc, getDocs, query, getDoc, setDoc} from "firebase/firestore";


function ItemsTab() {
  const {user} = useUser();
  const [inventory, setInventory] = useState([]);
  const [itemsList, setItemsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const getInventoryList = async () => {
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
                  createdAt: data.createdAt ? data.createdAt.toDate() : new Date(0),
                  icon: data.icon || '🧺', // Use the saved icon or a default one
                  ...data,
              });
          }
      }
      inventoryList.sort((a, b) => b.createdAt - a.createdAt);
      setInventory(inventoryList);
      console.log("Inventory state updated:", inventoryList);
  };
  /**
   * This method gets all the items added to the firebase.
   * Get's all the items from each category and adds them to the same list
   */
  const getAllItems = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const allItemsData = [];
  
    if (!docs.empty) {
      for (const document of docs.docs) {
        const subCollectionRef = collection(firestore, 'inventory', document.id, 'items');
        const subCollectionSnapshot = await getDocs(subCollectionRef);
  
        subCollectionSnapshot.forEach((itemDoc) => {
          const itemData = itemDoc.data();
          allItemsData.push({
            id: itemDoc.id,
            name: itemData.name, // Use name field if it exists, otherwise use id
            category: document.id,
            createdAt: itemData.createdAt ? itemData.createdAt.toDate() : new Date(0),
            ...itemData,
            
          });
        });
      }
    }
  
    allItemsData.sort((a, b) => b.createdAt - a.createdAt);
    console.log("Fetched all items: ", allItemsData);
    setItemsList(allItemsData);
  }

  useEffect(() => {
    getInventoryList()
    getAllItems()
  }, [])

  const getDisplayedItems = () => {
    if (!searchTerm.trim()) return itemsList;
    return itemsList.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  return (
    <div className='p-8'>
      
      <h2 className='font-bold text-3xl'>My Pantry Items🥔🥬🍯</h2>
      <p className='text-gray-500 mt-2'>Here's the list of all the items added</p>
      <SearchBar 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} />
        <div className='grid grid-cols-1 md:grid-cols-3 mt-6'>
          <div className='md:col-span-2'>
          <h2 className='font-bold text-lg'>Latest Items Added</h2>
              <ItemListTable
                itemsList= {getDisplayedItems()}
                refreshData={() => {
                    getInventoryList();
                    getAllItems();
                }} />
          </div>
        </div>
    </div>
  )
}

export default ItemsTab
/**
 *  {itemsList?.length>0?
                <ItemListTable
                itemsList= {getDisplayedItems()}
                refreshData={() => {
                    getInventoryList();
                    getAllItems();
                }} />
            :
                [1, 2, 3, 4, 5].map((item, index) => (
                    <div key={index} className='w-full bg-slate-200 rounded-lg h-[100px] animate-pulse'></div>
                ))
            }
 */