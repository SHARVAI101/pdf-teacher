import React from 'react'
import Navbar from '../Components/Navbar'
import AddButton from '../Components/AddButton'

function Dashboard() {
  return (
    <div>
        <Navbar />
        <div className='px-4 lg:px-20 pt-5'>
            <h1 className='text-2xl'>Create new project</h1>
            <AddButton />
            <h1 className='text-1xl'>My previous projects</h1>
        </div>
    </div>    
  )
}

export default Dashboard