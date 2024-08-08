"use client"
import { UserButton, useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
import CardsInfo from './_components/CardsInfo';
import { firestore } from '@/firebase'
import { collection, deleteDoc, doc, getDocs, query, getDoc, setDoc } from "firebase/firestore";
import CategoryItem from './tracker/_components/CategoryItem';
import ItemListTable from './items/_components/ItemListTable';
import Link from 'next/link';

function Dashboard() {
  const { user } = useUser();
  const [inventory, setInventory] = useState([]);
  const [itemsList, setItemsList] = useState([]);

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

  return (
    <div className='p-8'>
      <h2 className='font-bold text-3xl'>Hi, {user?.fullName}✨</h2>
      <p className='text-gray-500'>Here's all the information about your pantry.
        Start adding categories in the <Link href="/dashboard/tracker" className='underline text-blue-600'>Tracker tab</Link></p>
      <CardsInfo inventoryList={inventory} />

      <div className='grid grid-cols-1 md:grid-cols-3 mt-6 gap-3'>
        <div className='md:col-span-2 '>
          <h2 className='font-bold text-lg'>Latest Items Added</h2>
          <ItemListTable
            itemsList={itemsList.slice(0, 7)}
            refreshData={() => {
              getInventoryList();
              getAllItems();
            }} />
        </div>
        <div className='grid gap-3'>
          <h2 className='font-bold text-lg mt-2 '>Latest Categories</h2>
          {inventory?.length > 0 ?
            (inventory.slice(0, 3)).map((doc) =>
            (<CategoryItem
              key={doc.name}
              category={doc.name}
              subItemCount={doc.subItemCount}
              icon={doc.icon}
            />
            ))
            :
            (<div className=" grid gap-3 justify-center items-center h-full py-6">
              <h2 className="text-center text-gray-600">No Categories added yet!</h2>
            </div>)
          }
        </div>
      </div>
    </div>
  )
}

export default Dashboard