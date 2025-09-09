import React, { useEffect } from 'react'
import StockTable from '../components/StockTable'
import { useStockStore } from '../stores/useStockStore'
import FilterForm from '../components/FilterForm';
import SkeletonStockTable from '../components/skeletons/SkeletonStockTable';
import WarehouseGrid from '../components/WarehouseGrid';

const Stock = () => {
    const { getStock, loading } = useStockStore();
    useEffect(() => {
        getStock();
    }, [getStock])
    return (
        <div>
            <div className="flex flex-wrap gap-5 justify-center items-top my-10">
                <FilterForm/>
            </div>
            <div className="flex flex-wrap gap-5 justify-center items-top mb-10">
                {!loading ? <StockTable/> : <SkeletonStockTable/>}
            </div>
            <div className="flex flex-wrap gap-5 justify-center items-top mb-20 px-5">
                {!loading && <WarehouseGrid />}
            </div>
        </div>
    )
}

export default Stock
