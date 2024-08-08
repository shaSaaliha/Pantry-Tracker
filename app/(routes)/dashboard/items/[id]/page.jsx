"use client"
import React, { useEffect, useState } from 'react';
import { firestore } from '@/firebase';
import { collection, deleteDoc, doc, getDoc, getDocs, query } from "firebase/firestore";
import CategoryItem from '../../tracker/_components/CategoryItem';
import AddItems from '../_components/AddItems';
import ItemListTable from '../_components/ItemListTable';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

function Items({ params }) {
  const [categoryName, setCategoryName] = useState('');
  const [categoryData, setCategoryData] = useState([]);
  const [itemsList, setItemsList] = useState([]);
  const { id } = params;
  const decodedId = decodeURIComponent(id); // Decode the URL-encoded id
  const router = useRouter();
  const [inventory, setInventory] = useState([])

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs  = await getDocs(snapshot)
    const inventoryList = []
    if (docs.empty) {
      router.replace('/dashboard/tracker')
    } else {
      
      docs.forEach((doc)=>{
          const data = doc.data();
          inventoryList.push({
              name: doc.id,
              icon: data.icon || '📋', // Use the saved icon or a default one
              ...data,
          })
    })}
    setInventory(inventoryList)
    }

  const getCategoryData = async () => {
    console.log(`Fetching inventory for category ID: ${decodedId}`);
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const categoryData = [];

    if (!docs.empty) {
      for (const document of docs.docs) {
        if (document.id === decodedId) { // Only process the document that matches the id parameter
          const subCollectionSnapshot = await getDocs(collection(firestore, 'inventory', document.id, 'items'));
          const subItemCount = subCollectionSnapshot.size; // Get the count of sub-items

          const data = document.data();
          categoryData.push({
            name: document.id,
            subItemCount: subItemCount,
            icon: data.icon || '🧺', // Use the saved icon or a default one
            ...data,
          });
        }
      }
    }
    setCategoryData(categoryData);
  };

  const getCategoryItems = async () => {
    const subCollectionRef = collection(firestore, 'inventory', decodedId, 'items');
    const subCollectionSnapshot = await getDocs(subCollectionRef);

    console.log("Fetching sub-collection for document:", decodedId);

    const itemList = subCollectionSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          name: doc.id,
          createdAt: data.createdAt ? data.createdAt.toDate() : new Date(0),
          ...data
        };
    });

    itemList.sort((a, b) => b.createdAt - a.createdAt);
    setItemsList(itemList);
  };
  /**
   * For the deletion process, we'll need to:
   * a) Delete the category document
   * b)Delete all items in the category's subcollection
   * c)Redirect the user
   * @param {String} categoryId 
   */
  const deleteCategory = async (categoryId) => {
    try {
      // Delete all items in the category
      const itemsRef = collection(firestore, 'inventory', categoryId, 'items');
      const itemsSnapshot = await getDocs(itemsRef);
      const deleteItemPromises = itemsSnapshot.docs.map(doc => 
        deleteDoc(doc.ref)
      );
      await Promise.all(deleteItemPromises);

      // Delete the category document
      const categoryRef = doc(firestore, 'inventory', categoryId);
      await deleteDoc(categoryRef);

      toast("Category and all its items deleted successfully!");
        // Redirect to the tracker screen
        router.push('/dashboard/tracker');
    } catch (error) {
        console.error("Error deleting category:", error);
        toast("Error deleting category. Please try again.");
    }
  }

  useEffect(() => {
    if (decodedId) {
      console.log(`ID is available: ${decodedId}`);
      getCategoryData();
      getCategoryItems();
    } else {
      console.log("ID is not available");
    }
  }, [decodedId, getCategoryData, getCategoryItems]);

  return (
    <div className='p-10'>
      <h2 className='flex justify-between'>
        <h2 className='text-2xl font-bold flex items-center'>
          <ArrowLeft className='cursor-pointer'
          onClick={()=>router.replace('/dashboard/tracker')}/>
             My Pantry Items</h2>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button className = 'flex gap-2' variant="destructive"> 
                        <Trash/> Delete Category</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this category and 
                        the items added in it.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                        onClick = {()=>deleteCategory(decodedId)}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
      </h2>
        
      <div className='grid grid-cols-1 md:grid-cols-2 mt-5 gap-5'>
        {categoryData?.length>0? categoryData.map((doc) => 
              (<CategoryItem
                  key={doc.name} 
                  category={doc.name} 
                  subItemCount={doc.subItemCount}
                  icon={doc.icon}
              />
            ))
            :<div className='w-full bg-slate-200 rounded-lg h-[80px] animate-pulse'></div>
        }
        <AddItems 
            category={decodedId}
            refreshData={() => {
              getCategoryData();
              getCategoryItems();
            }}
        />
      </div>
      <div className='mt-4'>
        <h2 className='font-bold text-lg'>Latest Items Added</h2>
            <ItemListTable 
                itemsList={itemsList}
                refreshData={() => {
                    getCategoryData();
                    getCategoryItems();
                }}
            />
      </div>
    </div>
  );
}

export default Items;
