import React from 'react'

function GptTextBlob({ message }) {
  return (
    <div className='bg-gradient-to-r from-pink-700 to-orange-700 text-white p-4 rounded-lg justify-self-start my-1'  style={{ maxWidth: '80%' }} >
        <p>{ message }</p>
    </div>
  )
}

export default GptTextBlob