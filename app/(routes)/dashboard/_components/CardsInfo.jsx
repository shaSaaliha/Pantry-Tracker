import { Croissant, List, NotebookTabs, Receipt } from 'lucide-react'
import React, { useEffect, useState } from 'react'

function CardsInfo({ inventoryList }) {
    const [totalCat, setTotalCat] = useState(0);
    const [totItems, setTotItems] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const calculateCardInfo = () => {
        setIsLoading(true)
        const totalCategories = inventoryList.length;
        const totalItems = inventoryList.reduce((sum, category) => sum + category.subItemCount, 0);
        setTotalCat(totalCategories);
        setTotItems(totalItems);

        setIsLoading(false)
    }
    useEffect(() => {
        calculateCardInfo()
    }, [calculateCardInfo, inventoryList])

    return (
        <div>
            {isLoading && inventoryList.length > 0 ? (
                <div className='mt-7 grid grid-cols-1 md:grid-cols-2 gap-5'>
                    {[1, 2].map((item, index) => (
                        <div key={index} className='w-full bg-slate-200 rounded-lg h-[100px] animate-pulse'>
                        </div>
                    ))}
                </div>
            ) : (
                <div className='mt-7 grid grid-cols-1 md:grid-cols-2 gap-5'>
                    <div className='p-7 border rounded-lg flex items-center justify-between'>
                        <div>
                            <h2 className="font-bold text-green-600 text-lg">Total Categories</h2>
                            <h2 className='text-1xl'>{totalCat}</h2>
                        </div>
                        <NotebookTabs className='bg-green-600 p-3 h-10 w-10 rounded-full text-white' />
                    </div>
                    <div className='p-7 border rounded-lg flex items-center justify-between'>
                        <div>
                            <h2 className="font-bold text-green-600 text-lg">Total Items</h2>
                            <h2 className='text-1xl'>{totItems}</h2>
                        </div>
                        <List className='bg-green-600 p-3 h-10 w-10 rounded-full text-white' />
                    </div>
                </div>
            )}
        </div>
    )
}

export default CardsInfo