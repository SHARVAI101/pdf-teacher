import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const Learn = () => {
  const location = useLocation();
  const projectID = location.state?.projectID;

  return (
    <div>
      <h1>Audio Player page {projectID}</h1>
      <audio src="http://localhost:8000/static/audio/speech.mp3" controls></audio>
    </div>
  );
};

export default Learn;
