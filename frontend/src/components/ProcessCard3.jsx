import React from 'react'
import Button from './Button'
import { useQrCodeStore } from '../stores/useQrCodeStore';
import { useMeasurementsStore } from '../stores/useMeasurementsStore';
import { useProcessStore } from '../stores/useProcessStore';

const ProcessCard3 = () => {
  const { generateQrCode } = useQrCodeStore();
  const { measurements, updateMeasurements } = useMeasurementsStore();
  const { nextStep } = useProcessStore();
  const [note, setNote] = React.useState('');

  const handleClick = async () => {
    let obj = { ...measurements, note };
    updateMeasurements({ note });
    await generateQrCode(obj);
    nextStep();
  };

  return (
    <div className="rounded-xl bg-white shadow-lg w-md min-h-120">
        <div className="w-full bg-cyan-600 rounded-t-xl h-2"/>
        <div className="p-5 h-full">
            <div className="flex flex-row items-center justify-center w-full gap-5">
              <div className={`p-2 rounded-full ${measurements ? "bg-cyan-600" : "bg-gray-200"} ${measurements ? "text-white" : "text-gray-800"} w-12 h-12 flex flex-col items-center font-extrabold text-center text-xl`}>3</div>
              <p className="font-bold text-2xl text-gray-800">QR Code Generation</p>
            </div>
            <p className="text-gray-600 text-lg my-5 mx-10">QR Code marking with all measurement data</p>
            {!measurements ? (
              <div className="justify-center w-full items-center flex my-20">
                <p className="text-lg text-gray-500">Waiting for the measurements...</p>
              </div>
            ) : (
              <div className="justify-center w-full items-center flex flex-col text-center my-20 gap-5">
                <label>You can add a note to the box if you want:<br/>(It might be helpful for finding this box in the future.)</label>
                <input onChange={(e) => {setNote(e.target.value)}} name="qr" type="text" className="p-3 rounded-full bg-white text-gray-800 w-full text-center border-2 border-gray-800" placeholder="Optional Note"/>
                <Button onClick={handleClick} text="Generate QR Code"/>
              </div>
            )}
        </div>
    </div>
  )
}

export default ProcessCard3
