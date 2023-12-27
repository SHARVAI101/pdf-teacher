import React, { useRef } from 'react'

function AudioPlayer({ audioFilePath }) {
    const audioRef = useRef(null);

    const handlePause = () => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
    };

    return (
        <div className='p-4 rounded-lg bg-gradient-to-r from-pink-500 to-orange-500'>
            <div className='grid grid-cols-2 items-center'>
                <div>
                    <p className='text-white mb-1' style={{fontSize: 24}}>Play explanation</p>
                </div>
                <div className='justify-self-end'>
                    <button onClick={handlePause} className='bg-green-700 shadow-md hover:bg-green-600 p-3 text-white rounded-lg transition duration-300 ease-in-out'>Pause! I have a doubt!</button>
                </div>
            </div>
            
            <audio src={audioFilePath} ref={audioRef} className='w-full mt-3' controls></audio>
        </div>
    )
}

export default AudioPlayer