import React from 'react'
import ProcessCard1 from '../components/ProcessCard1'
import ProcessCard2 from '../components/ProcessCard2'
import ProcessCard3 from '../components/ProcessCard3'
import ProcessCard4 from '../components/ProcessCard4'
import ProgressBar from '../components/ProgressBar'
import { useProcessStore } from '../stores/useProcessStore'

const Home = () => {
  const { step } = useProcessStore();

  const renderStep = () => {
    switch (step) {
      case 1:
        return <ProcessCard1 />;
      case 2:
        return <ProcessCard2 />;
      case 3:
        return <ProcessCard3 />;
      case 4:
      default:
        return <ProcessCard4 />;
    }
  };

  return (
    <div className="">
        <ProgressBar />
        <div className="flex flex-wrap gap-5 justify-center items-top my-20 mi-w-[400px] w-full">
            {renderStep()}
        </div>
    </div>
  )
}

export default Home
