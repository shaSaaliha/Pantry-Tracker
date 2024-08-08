'use client'
import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { firestore } from '@/firebase'
import { collection, deleteDoc, doc, getDocs, query, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { toast } from 'sonner';
import EmojiPicker from 'emoji-picker-react'
import { useRouter } from 'next/navigation';

function CreateList({ refreshData }) {
    const [emojiIcon, setEmojiIcon] = useState('📋');
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
    const [inventory, setInventory] = useState([])
    const [documentName, setDocumentName] = useState('');
    const router = useRouter();

    const updateInventory = async () => {
        const snapshot = query(collection(firestore, 'inventory'))
        const docs = await getDocs(snapshot)
        const inventoryList = []

        docs.forEach((doc) => {
            const data = doc.data();
            inventoryList.push({
                name: doc.id,
                icon: data.icon || '📋', // Use the saved icon or a default one
                ...data,
            })
        })
        setInventory(inventoryList)
        console.log(inventoryList)
    }

    const createCategoryDocument = async () => {
        const capitalizedDocName = capitalizeFirstLetter(documentName);
        const docRef = doc(collection(firestore, 'inventory'), capitalizedDocName);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            await setDoc(docRef, {
                name: capitalizedDocName,
                icon: emojiIcon,
                createdAt: serverTimestamp(),
            });
        }

        await updateInventory();
        refreshData() //Helps add the new category immediately to the screen
        toast('New Category Added!');
        setDocumentName(''); // Clear input after creating document
    }

    useEffect(() => {
        updateInventory()
    }, [updateInventory])

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <div className='bg-slate-100 p-5 rounded-md
                items-center flex flex-col border-2 border-dashed
                cursor-pointer hover:shadow-md'>
                        <h2 className='text-2xl'>+</h2>
                        <h2>Add New Category</h2>
                    </div>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Product Category</DialogTitle>
                        <DialogDescription>
                            <div className='mt-3'>
                                <Button variant="outline"
                                    className="text-lg"
                                    onClick={() => setOpenEmojiPicker(!openEmojiPicker)}>{emojiIcon}</Button>
                                {openEmojiPicker && (
                                    <div className='absolute z-10'>
                                        <EmojiPicker
                                            onEmojiClick={(e) => {
                                                setEmojiIcon(e.emoji)
                                                setOpenEmojiPicker(false)
                                            }}
                                        />
                                    </div>
                                )}
                                <div className='mt-2'>
                                    <h2 className='text-black font-medium my-1'>Category Name</h2>
                                    <Input placeholder="e.g. Fruits"
                                        onChange={(e) => setDocumentName(e.target.value)} />
                                </div>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button
                                disabled={!(documentName)}
                                onClick={createCategoryDocument}
                                className="mt-5 w-full bg-green-600">Add</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default CreateList
