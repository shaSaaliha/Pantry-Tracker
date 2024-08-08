"use client"
import { firestore } from '@/firebase';
import { collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore'
import { Plus, SquareMinus, SquarePlus, Trash } from 'lucide-react'
import moment from 'moment'
import React from 'react'
import { toast } from 'sonner';

function ItemListTable({itemsList, refreshData}) {
    //Another way to output time: using toLocaleDateString()
    //<h2>{new Date(item.createdAt.seconds * 1000).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}</h2>

    const increaseItem = async (item) => {
        const itemDocRef = doc(firestore, 'inventory', item.category, 'items', item.name);
        const docSnap = await getDoc(itemDocRef);
  
        if(docSnap.exists()){
            //{quantity} is used in destructuring to extract a property named quantity from an object.
            const {quantity} = docSnap.data();
            await updateDoc(itemDocRef, {quantity: quantity + 1});
            toast("Quantity increased.");
        } else {
            toast("Item not found.");
        }
        refreshData();
    }

    const decreaseItem = async (item) => {
        const itemDocRef = doc(firestore, 'inventory', item.category, 'items', item.name);
        const docSnap = await getDoc(itemDocRef);
  
        if(docSnap.exists()){
            const {quantity} = docSnap.data();
            if (quantity <= 1) {
                await deleteDoc(itemDocRef);
                toast("Item removed as quantity reached zero.");
            } else {
                await updateDoc(itemDocRef, {quantity: quantity - 1});
                toast("Quantity decreased.");
            }
        } else {
            toast("Item not found.");
        }
        refreshData();
    }

    const deleteItem = async (item) =>{
        const itemDocRef = doc(firestore, 'inventory', item.category, 'items', item.name);
        await deleteDoc(itemDocRef);
        toast("Item Deleted!");
        refreshData();
      }
    

  return (
    <div className='mt-3'>
        <div className='grid grid-cols-4 bg-slate-200 p-2'>
            <h2 className='font-bold'>Name</h2>
            <h2 className='font-bold'>Quantity</h2>
            <h2 className='font-bold'>Date</h2>
            <h2 className='font-bold'>Actions</h2>
        </div>
        {itemsList?.length>0? 
            (itemsList.map((item) => (
                <div className='grid grid-cols-4 bg-slate-50 p-2'>
                    <h2>{item.name}</h2>
                    <h2>{item.quantity}</h2>
                    <h2>{moment(item.createdAt.seconds * 1000).format('MM/DD/YYYY')}</h2>
                    <h2 className='flex gap-6 '>
                        <SquarePlus className='text-green-500 cursor-pointer hover:shadow-md'
                            onClick={() => increaseItem(item)}/>
                        <SquareMinus className="cursor-pointer hover:shadow-md"
                            onClick={() => decreaseItem(item)}/>
                        <Trash className='text-red-600 cursor-pointer hover:shadow-md'
                            onClick={() => deleteItem(item)} />
                    </h2>
                </div>
            ))) 
            : 
            (<div className=" justify-center items-center h-full py-6">
                <h2 className="text-center text-gray-600">No Items added yet!</h2>
              </div>)
        }     
    </div>
  )
}

export default ItemListTable