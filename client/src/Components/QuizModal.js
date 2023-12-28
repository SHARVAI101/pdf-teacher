import React, { useEffect, useState } from 'react'
import Loading from './Loading';
import api from '../axiosConfig';

function QuizModal({ toggleModal }) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        console.log("called");
        api.post('/create_quiz', { "pdfText": "project.explanation" }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            console.log(response.data);
            setIsLoading(false);
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            setIsLoading(false);
        });
    }, []);

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
            {/* Modal Content */}
            <div className="relative top-20 mx-auto p-5 border w-4/5 md:w-1/2 shadow-lg rounded-md bg-white">
                <div className='grid grid-cols-1 w-full'>
                    <div className='grid grid-cols-2'>
                        <p style={{fontSize: 20}}>Take a quiz!</p>
                        <button className='justify-self-end' onClick={toggleModal}>Close</button>
                    </div>
                    <div className="flex items-center">
                        { isLoading && <div className='ml-2 flex'><Loading /> Preparing your quiz...</div>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QuizModal