import React, { useState, useRef } from "react";
import api from '../axiosConfig';
import MicRecorder from 'mic-recorder-to-mp3';

const Microphone = () => {
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
            console.log(response.data);
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
    <div>
        <button onClick={handleToggleRecording}>
            {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
    </div>
    );
};

export default Microphone;
