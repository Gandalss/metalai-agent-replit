import React, { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import { useStockStore } from '../stores/useStockStore'
import Modal from './Modal';
import { useNavigate } from 'react-router-dom';

const StockTable = () => {
    const { stock, getStock, setFiltered, filtered, filteredStock, deleteStockItem } = useStockStore();
    const [deletedIndex, setDeletedIndex] = useState(null);
    const [stockArray, setStockArray] = React.useState([]);
    const [modalOpen, setModalOpen] = useState(false)
    const [blink, setBlink] = useState(false)
    const navigate = useNavigate();

    useEffect(() => {
        if (filtered) setStockArray(filteredStock);
        else setStockArray(stock);
    }, [stock, filtered, filteredStock])

    useEffect(() => {
        if (filtered) {
            setBlink(true);
            const t = setTimeout(() => setBlink(false), 1000);
            return () => clearTimeout(t);
        } else {
            setBlink(false);
        }
    }, [filtered, filteredStock])

    const handleDelete = async (index) => {
        deleteStockItem(index)
        setModalOpen(false)
        setFiltered(false)
        await getStock(); 
        await setStockArray(stock);
        navigate("/");
    }

    return (
        <div className="rounded-xl relative overflow-x-auto shadow-lg mx-5 max-h-[1000px]">
            <table className="bg-white items-center text-center w-6xl">
                    <thead className="hover:bg-cyan-700 rounded-t-lg px-10 py-3 bg-cyan-600 text-white font-bold items-center justify-between">
                        <tr>
                            <th scope="col" className="p-4 items-center h-full justify-center">ID</th>
                            <th scope="col" className="items-center h-full justify-center">Width</th>
                            <th scope="col" className="items-center h-full justify-center">Height</th>
                            <th scope="col" className="items-center h-full justify-center">Depth</th>
                            <th scope="col" className="items-center h-full justify-center">Note</th>
                            <th scope="col" className="justify-end items-center h-full">
                                <Trash2 className="text-white text-right"/>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {stockArray.map((item, index) => (
                            <tr
                                key={index}
                                className={`ext-center px-10 py-3 ${filtered ? 'bg-green-200' : 'bg-white'} ${blink ? 'animate-pulse' : ''} hover:bg-gray-200`}
                            >
                                <th scope="row" className="text-gray-800 border-1 justify-center text-center items-center h-full border-transparent"><p>{item.id}</p></th>
                                <td className="text-gray-800 border-1 p-4 justify-center items-center h-full border-transparent">{item.width} mm</td>
                                <td className="text-gray-800 border-1 justify-center items-center h-full border-transparent">{item.height} mm</td>
                                <td className="text-gray-800 border-1 justify-center items-center h-full border-transparent">{item.depth} mm</td>
                                <td className="text-gray-800">"{item.note}"</td>
                                <td className="justify-end h-full items-center">
                                    <Trash2 className="text-red-700 hover:text-red-800 text-right cursor-pointer" onClick={() => {setDeletedIndex(item.id); setModalOpen(true)}}/>
                                </td>
                            </tr>
                        ))}
                        {stockArray.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center py-20 text-3xl">Nothing found with required filters!</td>
                            </tr>
                        )}
                    </tbody>
            </table>
            {/* Delete Modal */}
            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <div className="text-center w-56">
                <Trash2 size={56} className="mx-auto text-red-500" />
                <div className="mx-auto my-4 w-48">
                    <h3 className="text-lg font-bold text-gray-800">Confirm Delete</h3>
                    <p className="text-sm text-gray-500">
                    Are you sure you want to delete this item?
                    </p>
                </div>
                <div className="flex gap-4">
                    <button className="p-4 bg-red-600 rounded-xl text-white hover:bg-red-700 active:bg-red-500 cursor-pointer w-full" onClick={() => handleDelete(deletedIndex)}>Delete</button>
                    <button
                    className="px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-100 cursor-pointer rounded-xl w-full"
                    onClick={() => setModalOpen(false)}
                    >
                    Cancel
                    </button>
                </div>
                </div>
            </Modal>
        </div>
    )
}

export default StockTable