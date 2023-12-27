import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const Learn = () => {

  const { state } = useLocation();
  
  return (
    <div>
    <h1>Audio Player page</h1>
      {state.audioFile && (
        <audio src="http://localhost:8000/static/audio/speech.mp3" controls>
        </audio>
      )}
    </div>
  );
};

export default Learn;
