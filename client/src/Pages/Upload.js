import React, { useState } from 'react'
import Navbar from '../Components/Navbar'

function Upload() {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [name, setName] = useState("");
  const [file, setFile] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevents the default form submission behavior
    const formData = new FormData(event.target); // Creates a FormData object to handle form data

    // Here you can handle your form data, e.g., send it to a server
    // Example: console.log for demonstration purposes
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    // You can send formData to a server using fetch or axios
    // Example: fetch('/api/upload', { method: 'POST', body: formData });
  };

  return (
    <div className='w-full h-screen flex flex-col'>
      <Navbar />
      <div className='flex-grow flex items-start md:items-center justify-center'>
        <form action="" onSubmit={handleSubmit}  className='rounded-lg shadow-lg p-4 md:mt-[-20%]'>
          <p>Create new project</p>
          <input 
            type="text"
            placeholder="Project name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline my-2"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          
          <label
            for="file"
            class="mt-2 inline-block text-neutral-700 dark:text-neutral-200"
          >Attach file</label>
          <input
            class="relative m-0 cursor-pointer block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
            type="file"
            id="file" />
          {/* <input 
              type="password"
              placeholder="Password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline my-2"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
          /> */}
          { isError && <p className="text-red-500">{ errorMessage }</p>}
          <button 
            type="submit" 
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
          >
            Create Project
          </button>
        </form>
      </div>
    </div>
  )
}

export default Upload