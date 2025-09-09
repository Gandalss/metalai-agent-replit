import React, { useEffect } from 'react'
import { LoaderCircle } from 'lucide-react'
import { useMeasurementsStore } from '../stores/useMeasurementsStore'
import { useProcessStore } from '../stores/useProcessStore'

const ProcessCard2 = () => {
  const { loading, measurements } = useMeasurementsStore();
  const { nextStep } = useProcessStore();

  useEffect(() => {
    if (!loading && measurements) {
      nextStep();
    }
  }, [loading, measurements, nextStep]);
  return (
    <div className="rounded-xl bg-white shadow-lg w-md min-h-120">
        <div className="w-full bg-cyan-600 rounded-t-xl h-2"/>
        <div className="p-5 h-full">
            <div className="flex flex-row items-center justify-center w-full gap-5">
              <div className={`p-2 rounded-full ${measurements ? "bg-cyan-600" : "bg-gray-200"} ${measurements ? "text-white" : "text-gray-800"} w-12 h-12 font-extrabold text-center text-xl`}>2</div>
              <p className="font-bold text-2xl text-gray-800">Measurements</p>
            </div>
            <p className="text-gray-600 text-lg my-5 mx-10">Automatic analysis using computer vision</p>
            {(!measurements && !loading) && (
              <div className="justify-center w-full items-center flex my-20">
                <p className="text-lg text-gray-500">Waiting for the image processing...</p>
              </div> 
            )}
            {loading && !measurements && (
              <div className="justify-center w-full items-center flex my-20">
                <LoaderCircle className='animate-spin size-20 text-gray-800'/>
              </div> 
            )}
            {measurements && (
              <div className="justify-center w-full items-center flex flex-col text-center my-20 gap-3">
                <p className="text-xl text-cyan-700 font-bold">Measurements are done successfully!</p>
                <p className="text-md text-gray-500">Length: {measurements.width}mm, Depth: {measurements.depth}mm, Height: {measurements.height}mm</p>
              </div>
            )}
        </div>
    </div>
  )
}

export default ProcessCard2
