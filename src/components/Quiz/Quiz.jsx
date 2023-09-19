import { useState } from "react";
import "./Quiz.css";
import { CheckCircle, CloseCircle } from "../icons";

export default function Quiz({
  imageUrl,
  question,
  options,
  answer,
  showFeedback = false,
  onSelectedOptionChange,
}) {
  const [selectedOption, setSelectedOption] = useState(null);

  function handleOptionOnClick(idx) {
    setSelectedOption(idx);
    onSelectedOptionChange(idx);
  }

  return (
    <div className="quiz">
      <div className="quiz__header">
        <img className="quiz__img" src={imageUrl} />
        <div className="quiz__question">{question}</div>
      </div>
      <div className="quiz__options">
        {options.map((option, idx) => {
          let classList = ["quiz__option"];
          if (showFeedback) {
            // display only correct option if user did not select OR user selected right option
            if (
              (selectedOption === null && selectedOption === idx) ||
              (selectedOption === answer && selectedOption === idx)
            ) {
              classList.push("quiz__option--true");
              // display only correct option
            } else {
              if (answer === idx) {
                classList.push("quiz__option--true");
              }
              if (selectedOption === idx) {
                classList.push("quiz__option--false");
              }
            }
          } else {
            if (selectedOption === idx) {
              classList.push("quiz__option--selected");
            }
          }

          return (
            <button
              disabled={showFeedback}
              className={classList.join(" ")}
              key={idx}
              onClick={() => handleOptionOnClick(idx)}
            >
              <span>{option}</span>
              {classList.includes("quiz__option--true") && <CheckCircle />}
              {classList.includes("quiz__option--false") && <CloseCircle />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
