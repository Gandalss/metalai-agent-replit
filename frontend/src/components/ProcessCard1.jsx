import React from 'react'
import Button from './Button'
import { useMeasurementsStore } from '../stores/useMeasurementsStore'
import { useProcessStore } from '../stores/useProcessStore'
import { useDualEsp32Store } from '../stores/useDualEsp32Store'
import { compressImage, formatFileSize, isValidImageFile } from '../utils/imageCompression'

const ProcessCard1 = () => {
  const { getMeasurements, updateMeasurements } = useMeasurementsStore();
  const { nextStep } = useProcessStore();
  const { capture } = useDualEsp32Store();
  const [image1, setImage1] = React.useState(null);
  const [image2, setImage2] = React.useState(null);
  const [preview1, setPreview1] = React.useState(null);
  const [preview2, setPreview2] = React.useState(null);
  const [compressing1, setCompressing1] = React.useState(false);
  const [compressing2, setCompressing2] = React.useState(false);
  const [originalSizes, setOriginalSizes] = React.useState({ image1: null, image2: null });
  const [compressedSizes, setCompressedSizes] = React.useState({ image1: null, image2: null });

  const handleClick = async () => {
    if (image1 && image2) {
      nextStep();
      await getMeasurements(image1, image2);
    }
  };

  const handleDualClick = async () => {
    const result = await capture();
    if (result && result.images) {
      const download = (b64, name) => {
        const link = document.createElement('a');
        link.href = `data:image/jpeg;base64,${b64}`;
        link.download = name;
        link.click();
      };
      if (result.images.front) download(result.images.front, 'front.jpg');
      if (result.images.side) download(result.images.side, 'side.jpg');
    }
    if (result && result.data) {
      updateMeasurements(result.data);
      nextStep();
    }
  };

  // Helper function to handle file processing with compression
  const processFile = async (file, setImage, setPreview, setCompressing, imageKey) => {
    if (!isValidImageFile(file)) {
      alert('Please select a valid image file (JPEG, PNG, WebP)');
      return;
    }

    setCompressing(true);
    const originalSize = file.size;
    
    try {
      const compressedFile = await compressImage(file, 1024 * 1024); // 1MB max
      setImage(compressedFile);
      setPreview(URL.createObjectURL(compressedFile));
      
      // Update size tracking
      setOriginalSizes(prev => ({ ...prev, [imageKey]: originalSize }));
      setCompressedSizes(prev => ({ ...prev, [imageKey]: compressedFile.size }));
      
      console.log(`Image ${imageKey} compressed: ${formatFileSize(originalSize)} -> ${formatFileSize(compressedFile.size)}`);
    } catch (error) {
      console.error('Failed to compress image:', error);
      alert('Failed to compress image. Please try again.');
    } finally {
      setCompressing(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    
    if (files[0] && !image1) {
      await processFile(files[0], setImage1, setPreview1, setCompressing1, 'image1');
    }
    if (files[1] && !image2) {
      await processFile(files[1], setImage2, setPreview2, setCompressing2, 'image2');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="rounded-xl bg-white shadow-lg w-md min-h-120">
        <div className="w-full bg-cyan-600 rounded-t-xl h-2"/>
        <div className="p-5">
            <div className="flex flex-row items-center justify-center w-full gap-5">
              <div className="p-2 rounded-full bg-cyan-600 text-white w-12 h-12 font-extrabold text-center text-xl">1</div>
              <p className="font-bold text-2xl text-gray-800">Image Capture</p>
            </div>
            <p className="text-gray-600 text-lg my-5 mx-10">Upload two photos in the correct order: <strong>1.</strong> from above to measure bottom and height, then <strong>2.</strong> from the side to measure width.</p>

            <p className="text-gray-600 text-lg my-5 mx-10">Position the metal piece on the measuring grid, upload two photos and press the button.</p>
            <div
              className="flex flex-col gap-2 my-4 border-2 border-dashed rounded-lg p-4 text-center"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <p className="text-gray-600">Drag & Drop both images here (first the top view, then the side view)</p>
              <label className="text-left">1. Top view (bottom &amp; height)
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={async (e) => {
                    if (e.target.files[0]) {
                      await processFile(e.target.files[0], setImage1, setPreview1, setCompressing1, 'image1');
                    }
                  }} 
                  disabled={compressing1}
                />
                {compressing1 && <span className="text-blue-600 text-sm ml-2">Compressing...</span>}
                {originalSizes.image1 && compressedSizes.image1 && (
                  <span className="text-green-600 text-sm ml-2">
                    {formatFileSize(originalSizes.image1)} → {formatFileSize(compressedSizes.image1)}
                  </span>
                )}
              </label>
              <label className="text-left">2. Side view (width)
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={async (e) => {
                    if (e.target.files[0]) {
                      await processFile(e.target.files[0], setImage2, setPreview2, setCompressing2, 'image2');
                    }
                  }} 
                  disabled={compressing2}
                />
                {compressing2 && <span className="text-blue-600 text-sm ml-2">Compressing...</span>}
                {originalSizes.image2 && compressedSizes.image2 && (
                  <span className="text-green-600 text-sm ml-2">
                    {formatFileSize(originalSizes.image2)} → {formatFileSize(compressedSizes.image2)}
                  </span>
                )}
              </label>
              <div className="flex gap-2 mt-2">
                {preview1 && <img src={preview1} alt="preview1" className="w-20 h-20 object-cover" />}
                {preview2 && <img src={preview2} alt="preview2" className="w-20 h-20 object-cover" />}
              </div>
            </div>
            <div className="justify-center w-full items-center flex flex-col gap-4 my-20">
              <Button onClick={handleClick} text="Take Measurements"/>
              <Button onClick={handleDualClick} text="Koordinierte Messung starten"/>
            </div>
        </div>
    </div>
  )
}

export default ProcessCard1

