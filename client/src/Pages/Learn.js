import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import api from '../axiosConfig';
import Loading from '../Components/Loading';
import PdfViewer from '../Components/PdfViewer';
import AudioPlayer from '../Components/AudioPlayer';

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
            <div className='grid grid-cols-1 md:grid-cols-3 md:gap-4 h-full'>
              <div className='md:col-span-2 shadow-lg rounded-lg p-4 flex flex-col bg-white'>
                <p style={{fontSize: 30}}>{project.projectName}</p>
                <PdfViewer pdfPath={project.filePath} />
              </div>
              <div className='col-span-1 shadow-lg rounded-lg p-4 flex flex-col min-h-0 bg-white mt-4 md:mt-0'>
                <p className='hidden md:block' style={{fontSize: 25}}>Explanation</p>
                <div className='flex-grow overflow-auto border-2 border-gray-200 rounded-md mt-2 mb-3 hidden md:block'>
                  <p className='p-2'>{project.explanation}</p>
                </div>
                <AudioPlayer audioFilePath={project.audioFilePath}/>
              </div>
            </div>
          </div>
        }
      </div>      
    </div>
  );
};

export default Learn;
