import React, { useRef, useState } from 'react'
import DoubtModal from './DoubtModal';

function AudioPlayer({ audioFilePath, project }) {
    const audioRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => {
        handlePause();
        setIsModalOpen(!isModalOpen);
    };

    const handlePause = () => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
    };

    return (
        <div className='p-4 rounded-lg bg-gradient-to-r from-pink-500 to-orange-500'>
            <div className='grid grid-cols-2 items-center'>
                <div>
                    <p className='text-white mb-1' style={{fontSize: 20}}>Play explanation</p>
                </div>
                <div className='justify-self-end'>
                    <button onClick={toggleModal} className='bg-green-700 shadow-md hover:bg-green-600 p-3 text-white rounded-lg transition duration-300 ease-in-out' style={{fontSize: 15}}>Pause! I have a doubt!</button>
                </div>
            </div>
            
            <audio src={audioFilePath} ref={audioRef} className='w-full mt-3' controls></audio>

            { isModalOpen && (
                <DoubtModal audioRef={audioRef} toggleModal={toggleModal} project={project}/>
            )}
        </div>
    )
}

export default AudioPlayer