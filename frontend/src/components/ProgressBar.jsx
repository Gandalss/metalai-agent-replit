import React from 'react';
import { useProcessStore } from '../stores/useProcessStore';

const steps = [1, 2, 3, 4];

const ProgressBar = () => {
  const { step } = useProcessStore();
  return (
    <div className="flex justify-center my-5 gap-4">
      {steps.map((s, index) => (
        <div key={s} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${step >= s ? 'bg-cyan-600' : 'bg-gray-300'}`}
          >
            {s}
          </div>
          {index !== steps.length - 1 && (
            <div className={`h-1 w-10 ${step > s ? 'bg-cyan-600' : 'bg-gray-300'}`}></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;
