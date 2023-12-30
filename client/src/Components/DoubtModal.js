import React, { useState } from 'react'
import GptTextBlob from './GptTextBlob';
import UserTextBlob from './UseTextBlob';
import api from '../axiosConfig';
import Loading from './Loading';
import Microphone from './Microphone';

function DoubtModal({ audioRef, toggleModal, project }) {

    const [allMessages, setAllMessages] = useState(["Hi, how may I help you?"]);
    const [isLoading, setIsLoading] = useState(false);

    const [currentMessage, setCurrentMessage] = useState("");

    const [isTypeMode, setIsTypeMode] = useState(true);

    const handleSubmit = () => {
        const trimmedMessage = currentMessage.trim();
        if (trimmedMessage !== "") {
            setAllMessages(prevMessages => [...prevMessages, trimmedMessage]);
            setCurrentMessage(""); 
            
            setIsLoading(true);

            api.post('/get_answer', { "question": trimmedMessage, "pdfText": project.explanation }, {
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

    const handleSubmitMicrophone = (message) => {
        const trimmedMessage = message.trim();
        if (trimmedMessage !== "") {
            setAllMessages(prevMessages => [...prevMessages, trimmedMessage]);
            // setCurrentMessage(""); 
            
            setIsLoading(true);

            api.post('/get_answer', { "question": trimmedMessage, "pdfText": project.explanation }, {
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

    const setCurrentMessageFunction = (message) => {
        console.log("mess="+message);
        setCurrentMessage(message);
        handleSubmit();
        console.log("=="+currentMessage);
    }

    const handleOptionClick = (option) => {
        console.log(option);
        if (option == "type" && !isTypeMode) {
            setIsTypeMode(true);
        }
        if (option == "talk" && isTypeMode) {
            setIsTypeMode(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
            {/* Modal Content */}
            <div className="relative top-20 mx-auto p-5 border w-4/5 md:w-1/2 shadow-lg rounded-md bg-white">
                <div className='grid grid-cols-1 w-full'>
                    <div className='grid grid-cols-2'>
                        <div className='flex'>
                            <p style={{fontSize: 20}}>Ask a doubt!</p>
                            <div className='ml-3 rounded-l-full rounded-r-full bg-gray-200 p-1 grid grid-cols-2' style={{width: 150}}>
                                <div onClick={() => handleOptionClick("type")} className={`rounded-l-full rounded-r-full ${isTypeMode == true?'bg-green-700' : 'bg-gray-200'} px-2 grid grid-cols-1 items-center cursor-pointer`}>
                                    <p className={`${isTypeMode == true?'text-white' : 'text-black'} text-center`} style={{fontSize: 12}}>Type</p>
                                </div>
                                <div onClick={() => handleOptionClick("talk")} className={`rounded-l-full rounded-r-full ${isTypeMode == false?'bg-green-700' : 'bg-gray-200'} px-2 grid grid-cols-1 items-center cursor-pointer`}>
                                    <p className={`${isTypeMode == false?'text-white' : 'text-black'} text-center`} style={{fontSize: 12}}>Talk</p>
                                </div>
                            </div>
                        </div>
                        <button className='justify-self-end' onClick={toggleModal}>Close</button>
                    </div>
                    <div className='border rounded border-gray-300 p-4 mb-2 mt-4 overflow-auto grid grid-cols-1' style={{maxHeight: 600}}>
                        {allMessages.map((message, index) => (
                            index % 2 === 0 ? 
                            <GptTextBlob key={index} message={message} /> :
                            <UserTextBlob key={index} message={message} />
                        ))}
                    </div>
                    { isTypeMode &&
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
                    }
                    { !isTypeMode && 
                    <div>
                        <Microphone handleSubmitMicrophone={handleSubmitMicrophone}/>
                    </div> }
                </div>
            </div>
        </div>
    )
}

export default DoubtModal