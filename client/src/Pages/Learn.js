import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import api from '../axiosConfig';
import Loading from '../Components/Loading';
import PdfViewer from '../Components/PdfViewer';
import AudioPlayer from '../Components/AudioPlayer';
import QuizModal from '../Components/QuizModal';
import NotesModal from '../Components/NotesModal';

const Learn = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const projectID = queryParams.get('projectID');

  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);

  const toggleModal = () => {    
    setIsModalOpen(!isModalOpen);
  };

  const toggleNotesModal = () => {    
    setIsNotesModalOpen(!isNotesModalOpen);
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

  // Tool tip for text selection
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [toolTipX, setToolTipX] = useState(0.0);
  const [toolTipY, setToolTipY] = useState(0.0);
  const [isToolTipTextSave, setIsToolTipTextSave] = useState(true);

  const textRef = useRef(null);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount || selection.toString().trim() === '') {
      setIsTooltipVisible(false);
      setIsToolTipTextSave(true);
      return;
    }
    // console.log(selection.getRangeAt(0).getBoundingClientRect());
    // console.log(selection.getRangeAt(0).getBoundingClientRect()["x"]);
    var x = selection.getRangeAt(0).getBoundingClientRect()["x"];
    var y = selection.getRangeAt(0).getBoundingClientRect()["y"];
    var width = selection.getRangeAt(0).getBoundingClientRect()["width"];
    setToolTipX(x+width/4);
    setToolTipY(y-50);
    setIsTooltipVisible(true);
  };

  const saveToNotes = () => {
    const selection = window.getSelection();
    setIsToolTipTextSave(false);
    setToolTipX(toolTipX+20);
    var note = selection.toString();
    api.post('/save_to_notes', { "projectID": projectID, "note": note }, {
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

    // navigator.clipboard.writeText(selection.toString()).then(() => {
        // Possibly show a confirmation message
        // setIsTooltipVisible(false);
    // });
  };

  

  return (
    <div className='flex flex-col w-full h-screen' onClick={handleTextSelection}>
      <Navbar />
      <div className='flex-grow overflow-auto'>
        { isLoading && <div className='w-full h-full flex justify-center items-center'><div className=''><Loading /></div></div> }
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
                      <p id="explanation-p" className='explanation-p' style={{fontSize: 25}}>Explanation</p>
                    </div>
                    <div className='justify-self-end'>
                      <button onClick={toggleNotesModal}><img src="https://cdn-icons-png.flaticon.com/512/1159/1159633.png" className="m-1 mr-4" style={{width: 30}} alt="" /></button>
                      {/* <button><img src="https://cdn-icons-png.flaticon.com/512/2793/2793765.png" className="m-1 mr-4" style={{width: 30}} alt="" /></button> */}
                    </div>
                  </div>
                </div>
                
                <div className='flex-grow overflow-auto border-2 border-gray-200 rounded-md mt-2 mb-3 hidden md:block'>
                  <p className='p-2' ref={textRef} >{project.explanation}</p>
                  {isTooltipVisible && (
                    <div className="absolute bg-black text-white p-2 rounded-md" style={{ top: toolTipY, left: toolTipX }}>
                      <button onClick={saveToNotes} className='flex items-center'>
                        {isToolTipTextSave && <span className='flex'>Save to Notes <img src="https://cdn-user-icons.flaticon.com/22664/22664815/1703816755490.svg?token=exp=1703817659~hmac=e3b59c23f7511dbeec261b53dab3bc82" className="ml-2" style={{width: 18}} alt="" /></span>}
                        {!isToolTipTextSave && <span className='flex'><img src="https://cdn-icons-png.flaticon.com/512/1443/1443000.png " className="mr-2" style={{width: 25}} alt="" /> Added!</span>}
                      </button>
                    </div>
                  )}
                </div>
                <AudioPlayer audioFilePath={project.audioFilePath} project={project}/>
              </div>
            </div>
          </div>
        }
        { isModalOpen && (
          <QuizModal toggleModal={toggleModal} project={project}/>
        )}
        {
          isNotesModalOpen && <NotesModal toggleNotesModal={toggleNotesModal} projectID={projectID} />
        }
      </div>      
    </div>
  );
};

export default Learn;
