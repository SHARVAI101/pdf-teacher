import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import api from '../axiosConfig';
import Loading from '../Components/Loading';
import PdfViewer from '../Components/PdfViewer';
import AudioPlayer from '../Components/AudioPlayer';
import QuizModal from '../Components/QuizModal';

const Learn = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const projectID = queryParams.get('projectID');

  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {    
    setIsModalOpen(!isModalOpen);
  };

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
                <div className='grid grid-cols-2 items-center'>
                  <div>
                    <p style={{fontSize: 30}}>{project.projectName}</p>
                  </div>
                  <div className='justify-self-end'>
                    <button onClick={toggleModal} className='py-2 px-4 bg-blue-500 text-white rounded-lg'>Take a quiz!</button>
                  </div>
                </div>
                <PdfViewer pdfPath={project.filePath} />
              </div>
              <div className='col-span-1 shadow-lg rounded-lg p-4 flex flex-col min-h-0 bg-white mt-4 md:mt-0'>
                <div className='hidden md:block'>
                  <div className='grid grid-cols-2 items-center '>
                    <div>
                      <p className='' style={{fontSize: 25}}>Explanation</p>
                    </div>
                    <div className='justify-self-end'>
                      <button><img src="https://cdn-icons-png.flaticon.com/512/1159/1159633.png" className="m-1 mr-6" style={{width: 30}} alt="" /></button>
                      <button><img src="https://cdn-icons-png.flaticon.com/512/2793/2793765.png" className="m-1 mr-4" style={{width: 30}} alt="" /></button>
                    </div>
                  </div>
                </div>
                
                <div className='flex-grow overflow-auto border-2 border-gray-200 rounded-md mt-2 mb-3 hidden md:block'>
                  <p className='p-2'>{project.explanation}</p>
                </div>
                <AudioPlayer audioFilePath={project.audioFilePath} project={project}/>
              </div>
            </div>
          </div>
        }
        { isModalOpen && (
          <QuizModal toggleModal={toggleModal} project={project}/>
        )}
      </div>      
    </div>
  );
};

export default Learn;
