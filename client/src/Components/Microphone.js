import React, { useState, useRef } from "react";
import api from '../axiosConfig';
import MicRecorder from 'mic-recorder-to-mp3';
import { FaMicrophone } from "react-icons/fa6";
import { FaRegCircleStop } from "react-icons/fa6";

const Microphone = ({ handleSubmitMicrophone }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [recorder, setRecorder] = useState(
      new MicRecorder({ bitRate: 128 })
    );

    const handleToggleRecording = async () => {

          if (isRecording) {

          recorder
          .stop()
          .getMp3().then( async ([buffer, blob]) => {
            const file = new File(buffer, 'test1.mp3', {
              type: blob.type,
              lastModified: Date.now()
            });

            // console.log(file);

            var formData = new FormData();
            formData.append('audio', file);
            const response = await api.post('/stopRecording', formData);
            handleSubmitMicrophone(response.data+"?");
          }).catch((e) => {
            alert('We could not retrieve your message');
            console.log(e);
          });
        } else {
        
        recorder.start().then(() => {
        }).catch((e) => {
          console.error(e);
        });
      };

      setIsRecording(!isRecording);
    }

    return (
    <div className="flex justify-center">
        <button onClick={handleToggleRecording} className="p-2 shadow-md rounded-lg border" style={{fontSize: 12}}>
            {isRecording ? 
              <span>
                {/* <img src="https://cdn-icons-png.flaticon.com/512/10181/10181283.png" className="mx-auto mb-1" style={{width: 55}}/> */}
                <FaRegCircleStop style={{fontSize: 30, margin: "5 auto", color: "#ff002f"}}/>
                Stop Recording
              </span> 
              : 
              <span>
                {/* <img src="https://cdn-icons-png.flaticon.com/512/3687/3687408.png " className="mx-auto mb-1" style={{width: 50}}/> */}
                <FaMicrophone style={{fontSize: 30, margin: "5 auto", color: "#ff002f"}}/>
                Start Recording
              </span>
            }
        </button>
    </div>
    );
};

export default Microphone;
