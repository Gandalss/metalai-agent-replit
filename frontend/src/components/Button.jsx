import React from 'react'

const Button = ({text, onClick, wFull=false}) => {
  return (
    <button onClick={onClick} className={`bg-cyan-600 text-white text-2xl rounded-full px-10 py-3 cursor-pointer hover:-translate-y-1 hover:shadow-md hover:bg-cyan-700 active:bg-cyan-500 transition-all duration-200 ${wFull ? "w-full" : ""}`}>
        {text}
    </button>
  )
}

export default Button