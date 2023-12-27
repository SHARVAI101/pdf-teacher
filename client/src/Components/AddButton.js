import React from 'react'
import { useNavigate } from 'react-router-dom';

function AddButton() {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    navigate('/upload');
  }
  
  return (
    <button onClick={handleClick} className='my-4 px-6 py-4 rounded-lg border-2 border-grey-800 shadow-md text-5xl bg-white'>+</button>
  )
}

export default AddButton