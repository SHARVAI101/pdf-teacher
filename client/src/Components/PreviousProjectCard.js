import React from 'react'
import { useNavigate } from 'react-router-dom';

function PreviousProjectCard({ project }) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/learn?projectID=${project.projectID}`);
  };

  return (
    <div onClick={handleClick} class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 cursor-pointer p-3">
        <img class="rounded-lg" src="https://tappedouttravellers.com/wp-content/uploads/2017/12/pexels-photo-297755-1-scaled.jpeg" alt="" />
        <div class="py-2">
            <h5 class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">{ project.projectName }</h5>
            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{ project.summary }</p>
            {/* <a href="#" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                Continue Learning
                <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                </svg>
            </a> */}
        </div>
    </div>
  )
}

export default PreviousProjectCard