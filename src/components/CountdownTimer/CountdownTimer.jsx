import { useState, useEffect, useRef } from "react";
import "./CountdownTimer.css";

export default function CountdownTimer({ value, onTimeup }) {
  const [timeLeft, setTimeLeft] = useState(value);
  const countdownTimer = useRef(null);

  useEffect(() => {
    countdownTimer.current = setInterval(() => {
      setTimeLeft((timeLeft) => {
        if (timeLeft <= 0) {
          return 0;
        }
        return timeLeft - 1;
      });
    }, 1000);
    return () => clearInterval(countdownTimer.current);
  }, [value]);

  useEffect(() => {
    if (timeLeft <= 0) {
      clearInterval(countdownTimer.current);
      onTimeup();
    }
  }, [timeLeft, onTimeup]);

  return (
    <div className="countdown-timer">
      <div className="bar">
        <div
          style={{
            width: ((timeLeft - 1) / (value - 1)) * 100 + "%",
          }}
          className="bar-contents"
        />
      </div>
      <span>{timeLeft}</span>
    </div>
  );
}