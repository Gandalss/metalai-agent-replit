import React from 'react'
import Button from './Button'
import { useQrCodeStore } from '../stores/useQrCodeStore';
import { LoaderCircle } from 'lucide-react';
import { useStockStore } from '../stores/useStockStore';
import { useMeasurementsStore } from '../stores/useMeasurementsStore';
import { useProcessStore } from '../stores/useProcessStore';
import toast from 'react-hot-toast';

const ProcessCard4 = () => {
  const { loading, qrCode } = useQrCodeStore();
  const { measurements } = useMeasurementsStore();
  const { postStock } = useStockStore();
  const { reset } = useProcessStore();

  const handleClick = () => {
    postStock(measurements);
    // Print QR Code
    toast.success("Successfully printed!");
    reset();
  };
  
  return (
    <div className="rounded-xl bg-white shadow-lg w-md min-h-120">
        <div className="w-full bg-cyan-600 rounded-t-xl h-2"/>
        <div className="p-5 h-full">
            <div className="flex flex-row items-center justify-center w-full gap-5">
              <div className={`p-2 rounded-full ${qrCode ? "bg-cyan-600" : "bg-gray-200"} ${qrCode ? "text-white" : "text-gray-800"} w-12 h-12 font-extrabold text-center text-xl`}>4</div>
              <p className="font-bold text-2xl text-gray-800">Labeling & Storage</p>
            </div>
            <p className="text-gray-600 text-lg my-5 mx-10">Print QR code and store metal piece.<br/><br/><span className="text-red-700">The metal piece will be added to the database after you print the QRCode.</span></p>
            {(!qrCode && !loading) && (
              <div className="justify-center w-full items-center flex my-20">
                <p className="text-lg text-gray-500">Waiting for the image processing...</p>
              </div> 
            )}
            {loading && !qrCode && (
              <div className="justify-center w-full items-center flex my-20">
                <LoaderCircle className='animate-spin size-20 text-gray-800'/>
              </div> 
            )}
            {qrCode && (
              <div className="justify-center w-full items-center flex flex-col text-center my-20 gap-4">
                <p className="text-xl text-cyan-700 font-bold">QR Code generated successfully!</p>
                <img src={qrCode} alt="QR Code" className="w-46 h-46 object-cover"/>
                <Button onClick={handleClick} text="Print QR Code"/>
              </div>
            )}
        </div>
    </div>
  )
}

export default ProcessCard4
