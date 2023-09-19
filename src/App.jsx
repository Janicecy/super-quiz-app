import { useEffect, useState } from "react";
import Quiz from "./components/Quiz";
import CountdownTimer from "./components/CountdownTimer";
import "./App.css";

async function fetchData() {
  const res = await fetch("/questions",);
  const data = await res.json();
  return data;
}

// Pause time before advancing to next quiz
const PAUSE_TIME_IN_MS = 3000;

export default function Quizzes() {
  const [quizzes, setQuizzes] = useState(null);
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showQuiz, setShowQuiz] = useState(true);
  const [userAnswers, setUserAnswers] = useState({}); //{ quiz_id: user_answer_idx }

  useEffect(() => {
    fetchData().then((data) => {
      setQuizzes(data.map((quiz, idx) => ({ ...quiz, id: idx })));
    }).catch(e => {});
  }, []);

  function handleOnTimeup() {
    setShowFeedback(true);
    if (currentQuizIdx < quizzes.length - 1) {
      preloadNextQuizImage();
      // pause before advancing to next quiz
      setTimeout(() => {
        displayNextQuiz();
      }, PAUSE_TIME_IN_MS);
    } else {
      setTimeout(() => {
        setCurrentQuizIdx(null);
      }, PAUSE_TIME_IN_MS);
    }
  }

  function preloadNextQuizImage() {
    const newQuiz = quizzes[currentQuizIdx + 1];
    const img = new Image();
    img.src = newQuiz.imageUrl;
  }

  function displayNextQuiz() {
    setShowFeedback(false);
    setShowQuiz(false);
    setCurrentQuizIdx(currentQuizIdx + 1);
    setTimeout(() => {
      setShowQuiz(true);
    });
  }

  function handleSelectOption(idx) {
    setUserAnswers({
      ...userAnswers,
      [quiz.id]: Number(idx),
    });
  }

  function calculateScore() {
    const quizMap = new Map(
      quizzes.map((quiz) => [String(quiz.id), quiz.answer])
    );
    return Object.entries(userAnswers).reduce((score, [quizId, userAnswer]) => {
      if (quizMap.get(quizId) === userAnswer) {
        return score + 1;
      }
      return score;
    }, 0);
  }

  if (!quizzes) {
    return "Loading...";
  }

  const isGameOver = currentQuizIdx === null;
  if (isGameOver) {
    const score = calculateScore();
    return (
      <div className="quiz-result">
        <div>Your Score</div>
        <div>
          {score}/{quizzes.length}
        </div>
      </div>
    );
  }

  const quiz = quizzes[currentQuizIdx];
  return (
    <div className="App">
      {showQuiz && (
        <>
          <CountdownTimer
            style={{ height: "5vh" }}
            value={quiz.time}
            onTimeup={handleOnTimeup}
          />
          <Quiz
            {...quiz}
            showFeedback={showFeedback}
            onSelectedOptionChange={handleSelectOption}
          />
        </>
      )}
    </div>
  );
}
