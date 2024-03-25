import React, { useEffect, useState } from "react";

const INITIAL = 0;
const LIMIT = 3;
const INTERVAL = 750;

/**
 * Draws an ellipsis loading indicator as "...".
 */
export default function Loading() {
  const [dots, setDots] = useState(INITIAL);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots === LIMIT ? INITIAL : prevDots + 1));
    }, INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      loading
      {Array(dots).fill(".").join("")}
    </div>
  );
}
