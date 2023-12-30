import React, { useState } from 'react'
import GptTextBlob from './GptTextBlob';
import UserTextBlob from './UseTextBlob';
import api from '../axiosConfig';
import Loading from './Loading';

function DoubtModal({ audioRef, toggleModal, project }) {

    const [allMessages, setAllMessages] = useState(["Hi, how may I help you?"]);
    const [isLoading, setIsLoading] = useState(false);

    const [currentMessage, setCurrentMessage] = useState("");

    const handleSubmit = () => {
        const trimmedMessage = currentMessage.trim();
        if (trimmedMessage !== "") {
            setAllMessages(prevMessages => [...prevMessages, trimmedMessage]);
            setCurrentMessage(""); 
            
            setIsLoading(true);

            api.post('/get_answer', { "question": currentMessage.trim(), "pdfText": project.explanation }, {
                headers: {
                  'Content-Type': 'application/json'
                }
              })
            .then(response => {
                console.log(response.data);
                setAllMessages(prevMessages => [...prevMessages, response.data.answer]);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                setIsLoading(false);
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
            {/* Modal Content */}
            <div className="relative top-20 mx-auto p-5 border w-4/5 md:w-1/2 shadow-lg rounded-md bg-white modal-enter">
                <div className='grid grid-cols-1 w-full'>
                    <div className='grid grid-cols-2'>
                        <p style={{fontSize: 20}}>Ask a doubt!</p>
                        <button className='justify-self-end' onClick={toggleModal}>Close</button>
                    </div>
                    <div className='border rounded border-gray-300 p-4 mb-2 mt-4 overflow-auto grid grid-cols-1' style={{maxHeight: 600}}>
                        {allMessages.map((message, index) => (
                            index % 2 === 0 ? 
                            <GptTextBlob key={index} message={message} /> :
                            <UserTextBlob key={index} message={message} />
                        ))}
                    </div>
                    <div className="flex items-center">
                        <textarea
                            className="w-full resize-none border rounded border-gray-300 p-2"
                            rows="2"
                            placeholder="Enter your question here"
                            value={currentMessage}
                            onChange={(e) => setCurrentMessage(e.target.value)}
                        />
                        { isLoading && <div className='ml-2'><Loading /></div>}
                        { !isLoading && <button
                            className="bg-green-700 text-white font-bold py-2 px-4 rounded ml-4"
                            onClick={handleSubmit}
                        >
                            Ask!
                        </button> }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DoubtModal