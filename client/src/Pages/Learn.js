import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import api from '../axiosConfig';
import Loading from '../Components/Loading';

const Learn = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const projectID = queryParams.get('projectID');

  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.post('/get_project_details', { "projectID": projectID }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      setProject(response.data);
      console.log(project);
      setIsLoading(false);
    })
    .catch(error => {
      console.error("Error fetching data:", error);
    });
  }, []);

  return (
    <div>
      <Navbar />
      { isLoading && <Loading /> }
      { !isLoading && 
        <div className='px-4 lg:px-20 pt-5'>
          <div className='grid grid-cols-3 gap-4'>
            <div className='col-span-2 shadow-lg rounded-lg'>
              hi
            </div>
            <div className='col-span-1 shadow-lg rounded-lg p-2'>
              <audio src={project.audioFilePath} controls></audio>
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default Learn;
