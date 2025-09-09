import React from 'react'
import Button from './Button'
import { useStockStore } from '../stores/useStockStore'

const FilterForm = () => {
    const [width, setWidth] = React.useState(0);
    const [height, setHeight] = React.useState(0);
    const [depth, setDepth] = React.useState(0);

    const { filterStock, setFiltered } = useStockStore();

    const handleButton = () => {
        filterStock({
            width: Number(width),
            height: Number(height),
            depth: Number(depth)
        })
    }

    const handleReset = () => {
        filterStock({width: 0, height: 0, depth: 0})
        setFiltered(false)
        setWidth(0)
        setHeight(0)
        setDepth(0)
    }

    return (
        <div class="rounded-xl bg-white flex flex-col gap-5 pb-5 shadow-lg overflow-scroll mx-5 justify-center">
            <div className="bg-cyan-600 rounded-t-xl py-4 px-5 w-full flex justify-center items-center">
                <h1 className="text-white font-bold text-xl">Filter</h1>
            </div>
            <div className="flex flex-wrap px-5 justify-center items-center gap-5">
                <div className="flex flex-wrap px-5 justify-center items-center gap-5">
                    <div>
                        <label className="text-xl me-3 text-gray-800">Minimum Box Width (mm):</label>
                        <input value={width} onChange={(e) => setWidth(e.target.value)} name="width" type="number" className="rounded-full p-2 bg-white w-full text-gray-800 text-center border-2 border-gray-500" placeholder="Width (mm)"/>
                    </div>
                </div>
                <div className="flex flex-wrap px-5 justify-center items-center gap-5">
                    <div>
                        <label className="text-xl me-3 text-gray-800">Minimum Box Height (mm):</label>
                        <input value={height} onChange={(e) => setHeight(e.target.value)} name="height" type="number" className="rounded-full p-2 bg-white w-full text-gray-800 text-center border-2 border-gray-500" placeholder="Height (mm)"/>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap px-5 justify-center items-center gap-5">
                <div>
                    <label className="text-xl me-3 text-gray-800">Minimum Box Depth (mm):</label>
                    <input value={depth} onChange={(e) => setDepth(e.target.value)} name="depth" type="number" className="rounded-full p-2 bg-white w-full text-gray-800 text-center border-2 border-gray-500" placeholder="Depth (mm)"/>
                </div>
            </div>
            <div className="flex flex-wrap md:flex-row px-5 justify-center w-full items-center gap-5">
                <Button onClick={handleButton} text="Filter" wFull={true}/>
                <Button onClick={handleReset} text="Reset Filter" wFull={true}/>
            </div>
        </div>
    )
}

export default FilterForm