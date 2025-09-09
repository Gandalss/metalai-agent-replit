import React from 'react';
import Button from '../components/Button';
import { useEsp32ImageStore } from '../stores/useEsp32ImageStore';
import { LoaderCircle } from 'lucide-react';

const Capture = () => {
    const { images, loading, capture } = useEsp32ImageStore();

    const handleCapture = () => {
        capture();
    };

    return (
        <div className="flex flex-col items-center my-10 gap-5">
            <Button text="Capture Images" onClick={handleCapture} />
            {loading && <LoaderCircle className="animate-spin size-20 text-gray-800" />}
            {images && !loading && (
                <div className="flex gap-5 mt-5 flex-wrap justify-center">
                    <img
                        src={`data:image/jpeg;base64,${images.front}`}
                        alt="Front"
                        className="w-60 h-60 object-contain border"
                    />
                    <img
                        src={`data:image/jpeg;base64,${images.side}`}
                        alt="Side"
                        className="w-60 h-60 object-contain border"
                    />
                </div>
            )}
        </div>
    );
};

export default Capture;
