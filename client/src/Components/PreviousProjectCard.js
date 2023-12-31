import React from 'react'
import { useNavigate } from 'react-router-dom';
import { FaCalendarDays } from "react-icons/fa6";
import img from '../images/img.png';
import img2 from '../images/img2.png';
import img3 from '../images/img3.png';
import img4 from '../images/img4.png';

function PreviousProjectCard({ project }) {
  const navigate = useNavigate();
  const images = [img, img2, img3, img4];
  
  const handleClick = () => {
    navigate(`/learn?projectID=${project.projectID}`);
  };

  return (
    <div onClick={handleClick} class="w-full  bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 cursor-pointer p-3 flex flex-col justify-between">
      <div>
          <img class="rounded-lg" src={images[project.imgNumber]} alt="" /> 
          {/* https://tappedouttravellers.com/wp-content/uploads/2017/12/pexels-photo-297755-1-scaled.jpeg */}
          <div class="py-2">
              <h5 class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">{ project.projectName }</h5>
              <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{ project.summary }</p>
          </div>
      </div>

      <div class="flex justify-start items-center">
          <FaCalendarDays style={{ color: "#d1d1d1" }}/> <p className='mt-1 ml-2 text-gray-400' style={{fontSize: 12}}>{ project.date }</p>
      </div>
  </div>
  )
}

export default PreviousProjectCard