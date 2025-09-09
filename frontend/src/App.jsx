import React from 'react'
import Navbar from './components/Navbar'
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import { Toaster } from 'react-hot-toast';
import Stock from './pages/Stock';
import Capture from './pages/Capture';

const App = () => {

  return (
    <div className="min-h-screen bg-gray-100 text-black relative overflow-hidden">
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/stock" element={<Stock/>}/>
        <Route path="/capture" element={<Capture/>}/>
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App
