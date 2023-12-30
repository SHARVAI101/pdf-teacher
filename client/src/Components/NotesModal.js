import React, { useEffect, useState } from 'react'
import api from '../axiosConfig';
import Loading from './Loading';

function NotesModal({ projectID, toggleNotesModal }) {
    const [isLoading, setIsLoading] = useState(true);
    const [notes, setNotes] = useState("");

    useEffect(() => {
        api.post('/get_notes', { "projectID": projectID }, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          setNotes(response.data.notes);
          console.log(notes);
          setIsLoading(false);
        })
        .catch(error => {
          console.error("Error fetching data:", error);
        });
    }, []);
    

    const handleSubmit = () => {
        console.log(notes);
        setIsLoading(true);
        api.post('/save_note', { "projectID": projectID, "notes": notes }, {
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
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            {/* Modal Content */}
            <div className="relative top-20 mx-auto p-5 border w-4/5 md:w-1/2 h-4/5 shadow-lg rounded-md bg-white">
                <div className="grid grid-cols-1 w-full h-full">
                    <div className="flex flex-col">
                        <div className="grid grid-cols-2">
                            {/* Header */}
                            <p className="flex" style={{ fontSize: 20 }}>
                                <img
                                src="https://cdn-icons-png.flaticon.com/512/1159/1159633.png"
                                className="ml-1 mr-2"
                                style={{ width: 30, height: 30 }}
                                alt=""
                                />
                                My notes
                            </p>
                            <button className="justify-self-end" onClick={toggleNotesModal}>
                                Close
                            </button>
                        </div>
                        {isLoading && <div className="mt-4 mx-auto"><Loading /></div>}
                        {/* Text area container */}
                        { !isLoading  && <div className="flex-grow mb-2 mt-4">
                            <textarea
                                className="w-full h-full p-2 border resize-none rounded min-h-0"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div> }
                        {/* Footer */}
                        <div className="">
                        {!isLoading && (
                            <button
                            className="bg-green-700 block text-white font-bold py-2 px-4 rounded mx-auto"
                            onClick={handleSubmit}
                            >
                            Save
                            </button>
                        )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NotesModal