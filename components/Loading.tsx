import React, { ComponentPropsWithoutRef, useEffect, useState } from "react";

const INITIAL = 0;
const LIMIT = 3;
const INTERVAL = 750;

type LoadingProps = ComponentPropsWithoutRef<"div">;

/**
 * Draws an ellipsis loading indicator as "...".
 */
export default function Loading(props: LoadingProps) {
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
    <div {...props}>
      loading
      {Array(dots).fill(".").join("")}
    </div>
  );
}
