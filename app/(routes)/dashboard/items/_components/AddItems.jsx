"use client"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useEffect, useState } from 'react'
import { firestore } from '@/firebase'
import { collection, deleteDoc, doc, getDocs, query, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { toast } from 'sonner';
import moment from 'moment';
import { Loader } from 'lucide-react';

function AddItems({ category, refreshData }) {
    const [itemName, setItemName] = useState('')
    const [quantity, setQuantity] = useState('')
    const [isMounted, setIsMounted] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    const addSubItem = async (subItem) => {
        if (!category) return;
        setLoading(true)

        const docRef = doc(collection(firestore, 'inventory'), category);
        const subCollectionRef = collection(docRef, 'items');
        const subDocRef = doc(subCollectionRef, subItem);
        const subDocSnap = await getDoc(subDocRef);

        const parsedQuantity = parseInt(quantity, 10);

        if (subDocSnap.exists()) {
            const { quantity: existingQuantity } = subDocSnap.data();
            await setDoc(subDocRef, {
                name: subItem,
                category: category,
                quantity: existingQuantity + parsedQuantity,
                createdAt: serverTimestamp(),
            });
        } else {
            await setDoc(subDocRef, {
                name: subItem,
                category: category,
                quantity: parsedQuantity,
                createdAt: serverTimestamp(),
            });
        }

        refreshData()
        setLoading(false)
        toast('New Item Added!');
        setItemName('')
        setQuantity('')
    }

    return (
        <div className='border p-5 rounded-md'>
            <h2 className='font-bold text-lg'>Add Items</h2>
            <div className='mt-2'>
                <h2 className='text-black font-medium my-1'>Product Name</h2>
                <Input
                    type="text"
                    placeholder="e.g. Apple"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    className="border rounded p-2 w-full"
                />
            </div>
            <div className='mt-2'>
                <h2 className='text-black font-medium my-1'>Quantity</h2>
                <Input
                    type='number'
                    placeholder="e.g. 1"
                    min="0"
                    value={quantity}
                    onChange={(e) =>
                        {const value = parseInt(e.target.value, 10);
                            if (value >= 0) {
                              setQuantity(e.target.value);
                            } else {
                              setQuantity(''); // Optional: reset to 0 if negative value is entered
                            }
                          }}
                    className="border rounded p-2 w-full"
                />
            </div>
            <Button disabled={!(itemName && quantity) || loading}
                onClick={() => addSubItem(itemName)}
                className="mt-3 w-full bg-green-600">
                {
                    loading ?
                        <Loader className='animate-spin' /> : "Add"
                }
            </Button>
        </div>
    );
}
export default AddItems
