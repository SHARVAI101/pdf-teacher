import React from 'react'

function UserTextBlob({ message }) {
  return (
    <div className='bg-gradient-to-r from-green-700 to-blue-700 text-white p-4 rounded-lg justify-self-end my-1' style={{ maxWidth: '80%' }} >
        <p>{ message }</p>
    </div>
  )
}

export default UserTextBlob