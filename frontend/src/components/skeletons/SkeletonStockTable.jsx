import React from 'react'
import { Loader2, Trash2 } from 'lucide-react'

const SkeletonStockTable = () => {
    return (
        <div className="rounded-xl max-w-screen relative overflow-scroll shadow-lg mx-5 max-h-[1000px]">
            <div className="bg-white items-center text-center w-6xl">
                    <div className="hover:bg-cyan-700 rounded-t-lg px-10 bg-cyan-600 text-white font-bold items-center justify-between">
                        <div className="flex flex-row gap-5 justify-between items-center">
                            <div scope="col" className="p-4 items-center font-bold h-full justify-center">ID</div>
                            <div scope="col" className="items-center h-full justify-center">Width</div>
                            <div scope="col" className="items-center h-full justify-center">Height</div>
                            <div scope="col" className="items-center h-full justify-center">Depth</div>
                            <div scope="col" className="items-center h-full justify-center">Note</div>
                            <div scope="col" className="justify-end items-center h-full">
                                <Trash2 className="text-white text-right"/>
                            </div>
                        </div>
                    </div>
                    <div className="py-20 flex items-center justify-center">
                        <Loader2 className="size-20 text-gray-800 animate-spin" />
                    </div>
            </div>
        </div>
    )
}

export default SkeletonStockTable