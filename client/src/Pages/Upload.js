import React, { useState } from 'react'
import Navbar from '../Components/Navbar'
import api from '../axiosConfig';
import Loading from '../Components/Loading';
import { useNavigate } from 'react-router-dom';

function Upload() {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [name, setName] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
      event.preventDefault(); 
      setIsLoading(true);
      
      try {
        // const response = await api.get('/text-to-speech');
        // // console.log(response.data);
        // console.log(response.data.audioFile);
        navigate('/learn', { state: { audioFile: "file://E:/Projects/pdf-teacher/server/speech.mp3" } });

      } catch (error) {
        console.error(error);
      }
  };

  return (
    <div className='w-full h-screen flex flex-col'>
      
          <Navbar />
          <div className='flex-grow flex items-start md:items-center justify-center'>
            <form onSubmit={handleSubmit} className='rounded-lg shadow-lg p-4 md:mt-[-20%]' enctype="multipart/form-data">
              <p className='text-center text-2xl mb-4'>Create new project</p>
              
              <label for="name" class="mt-2 inline-block text-neutral-700 dark:text-neutral-200">Project Name</label>
              <input 
                type="text"
                id="name"
                placeholder="Project name"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline my-2"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              
              <label for="file" class="mt-2 inline-block text-neutral-700 dark:text-neutral-200">Attach file</label>
              <input
                class="relative m-0 cursor-pointer block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                type="file"
                name="file"
                id="file"  />
              {/* <input 
                  type="password"
                  placeholder="Password"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline my-2"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
              /> */}
              { isError && <p className="text-red-500">{ errorMessage }</p>}
              { isLoading && <p className="w-full mt-4"><Loading /></p> }
              { !isLoading && <button 
                type="submit" 
                className="mt-6 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
              >
                Create Project
              </button>}
            </form>
          </div>
        
      
    </div>
  )
}

export default Upload