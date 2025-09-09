import React from 'react'
import { RulerDimensionLine } from 'lucide-react'
import Button from './Button'
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const redirectToStock = () => {
    navigate('/stock');
  }

  const redirectToCapture = () => {
    navigate('/capture');
  }

  const redirectToHome= () => {
    navigate('/');
  }

  return (
    <div className="bg-white shadow-lg py-10">
      <div className="flex justify-between items-center flex-wrap w-full">
        <div className="mx-auto flex flex-wrap justify-center text-center xl:text-left items-center xl:mx-10 xl:mb-0 mb-5">
          <div className="p-4 rounded-lg bg-cyan-600 text-white hidden md:block">
            <RulerDimensionLine onClick={redirectToHome} className="cursor-pointer" size={30}/>
          </div>
          <div className="mx-5 text-gray-800 cursor-pointer" onClick={redirectToHome}>
            <h1 className="text-4xl font-bold">Residual material acquisition system</h1>
            <p>Intelligent metal piece measurement</p>
          </div>
        </div>
        <div className="mx-auto flex flex-wrap gap-5 justify-center text-center items-center xl:mx-10">
          <Button onClick={redirectToStock} text="📦 Stock"/>
          <Button onClick={redirectToCapture} text="📷 Capture"/>
          <Button text="📊 Progress" />
        </div>
      </div>
    </div>
  )
}

export default Navbar
