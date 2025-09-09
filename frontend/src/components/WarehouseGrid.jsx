import React, { useEffect, useState } from 'react';
import { useStockStore } from '../stores/useStockStore';

const GRID_SIZE = 20;

const WarehouseGrid = () => {
  const { stock, filteredStock, filtered } = useStockStore();
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    if (filtered) {
      setBlink(true);
      const t = setTimeout(() => setBlink(false), 1000);
      return () => clearTimeout(t);
    } else {
      setBlink(false);
    }
  }, [filtered, filteredStock]);

  const highlightIds = new Set(filteredStock.map((item) => item.id));

  const boxes = Array.from({ length: GRID_SIZE }, (_, i) => {
    const item = stock[i];
    return {
      id: i + 1,
      item,
    };
  });

  return (
    <div className="grid grid-cols-5 gap-2">
      {boxes.map(({ id, item }) => (
        <div
          key={id}
          className={`border rounded p-2 text-center ${
            item
              ? filtered && highlightIds.has(item.id)
                ? 'bg-green-200'
                : 'bg-cyan-200'
              : 'bg-gray-100'
          } ${item && filtered && highlightIds.has(item.id) && blink ? 'animate-pulse' : ''}`}
        >
          <div className="text-sm font-bold">{id}</div>
          {item ? (
            <div className="text-xs">
              {item.width}x{item.height}x{item.depth}mm
            </div>
          ) : (
            <div className="text-xs text-gray-500">free</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default WarehouseGrid;
