import React, { useEffect, useState } from 'react'
import Navbar from '../Components/Navbar'
import AddButton from '../Components/AddButton'
import api from '../axiosConfig';
import Loading from '../Components/Loading';
import PreviousProjectCard from '../Components/PreviousProjectCard';

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.post('/get_previous_projects')
    .then(response => {
      console.log(response.data.projects);
      setProjects(response.data.projects);
      setIsLoading(false);
    })
    .catch(error => {
        console.error("Error fetching data:", error);
        setError(error);
        setIsLoading(false);
    });
  }, []);

  return (
    <div>
        <Navbar />
        <div className='px-4 lg:px-20 pt-5 pb-5'>
            <h1 className='text-2xl'>Create new project</h1>
            <AddButton />
            <h1 className='text-1xl mt-2'>My previous projects</h1>
            { isLoading && <div className='pt-3'><Loading /></div> }
            { !isLoading && projects.length > 0 ? (
    <div className='mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
      {projects.map((project, index) => (
        <PreviousProjectCard key={index} project={project} />
      ))}
    </div>
  ) : (
    !isLoading && <div className='mt-4 text-gray-300' style={{fontSize: 12}}>No previous projects.</div>
  )
            } 
        </div>
    </div>    
  )
}

export default Dashboard