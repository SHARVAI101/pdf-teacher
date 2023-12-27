import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import api from '../axiosConfig';
import Loading from '../Components/Loading';
import PdfViewer from '../Components/PdfViewer';

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
      setIsLoading(false);
      console.log(project);
    })
    .catch(error => {
      console.error("Error fetching data:", error);
    });
  }, []);

  return (
    <div className='flex flex-col w-full h-screen'>
      <Navbar />
      <div className='flex-grow overflow-auto'>
        { isLoading && <Loading /> }
        { !isLoading && 
          <div className='px-4 lg:px-20 py-5 h-full'>
            <div className='grid grid-cols-3 gap-4 h-full'>
              <div className='col-span-2 shadow-lg rounded-lg p-4'>
                <p>Project: {project.projectName}</p>
                <PdfViewer pdfPath={project.filePath} />
              </div>
              <div className='col-span-1 shadow-lg rounded-lg p-4 flex flex-col min-h-0'>
                <div className='flex-grow overflow-auto'>
                  <p>{project.explanation}</p>
                </div>
                <div>
                  <audio src={project.audioFilePath} controls></audio>
                </div>
              </div>
            </div>
          </div>
        }
      </div>      
    </div>
  );
};

export default Learn;
