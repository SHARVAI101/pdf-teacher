import React, { useState } from 'react'

function QuestionCarousel({ questions }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? questions.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    // const isLastSlide = currentIndex === questions.length - 1;
    // const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setSelectedOption(null);
    setCurrentIndex(currentIndex+1);
  };

  const handleOptionSelect = (option) => {
    if (questions[currentIndex].options[questions[currentIndex].correct_answer] == option && selectedOption==null) {
      setScore(score+1);
    }
    setSelectedOption(option);
  };

  const isCorrectAnswer = (option) => {
    const isCorrect = (option == questions[currentIndex].correct_answer);
    return isCorrect;
  };

  return (
    <div className="mt-4 pb-10 rounded-lg items-center justify-center mb-4 px-8 bg-gradient-to-r from-blue-500 to-indigo-500">
      {/* <button className="p-4" onClick={goToPrevious}>{"<"}</button> */}
      <span>{currentIndex+1}/{5}</span>
      <div className="w-full flex justify-center grid grid-cols-1">
        { currentIndex < 5 && 
          <div>
          <p className='text-lg font-semibold text-center mt-8 text-gray-200'>{ questions[currentIndex].question }</p>
          <div className="flex flex-col space-y-3 mt-6">
              {questions[currentIndex].options.map((option, index) => (
                <button 
                  key={index} 
                  className={`p-2 text-left ${selectedOption == option ? (isCorrectAnswer(index) ? 'bg-green-500' : 'bg-red-500') : 'bg-gray-100 hover:bg-gray-200'} rounded-md`}
                  onClick={() => handleOptionSelect(option)}
                >
                  {option}
                </button>
              ))}
          </div>
          <button className={`${selectedOption != null?'block' : 'hidden'} bg-blue-400 text-white rounded-lg mx-auto px-4 py-3 mt-8 `} onClick={goToNext}>{"Next >"}</button>
          </div>
        }
        { currentIndex == 5 && 
          <div>
            <p className='text-2xl text-center mt-8 text-white'>You've completed the test!</p>
            <p className='text-xl text-center mt-4 text-pink-300'>Your score is { score }/5</p>
          </div>
        }
      </div>
    </div>
  );
}

export default QuestionCarousel