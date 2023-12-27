import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import api from '../axiosConfig';

const Learn = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const projectID = queryParams.get('projectID');

  const [project, setProject] = useState(null);

  useEffect(() => {
    api.post('/get_project_details', { "projectID": projectID }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.error("Error fetching data:", error);
    });
  }, []);

  return (
    <div>
      <Navbar />
      
      <div className='px-4 lg:px-20 pt-5'>
        <div className='grid grid-cols-3 gap-4'>
          <div className='col-span-2 shadow-lg rounded-lg'>
            hi
          </div>
          <div className='col-span-1 shadow-lg rounded-lg p-2'>
            <audio src={{}} controls></audio>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learn;
