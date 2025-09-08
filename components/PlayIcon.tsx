import React from "react";

export function PlayIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      height="10"
      viewBox="0 0 10 10"
      {...props}
    >
      <path
        fill="currentColor"
        d="M4.5 8h1V2h-1zM2.5 9h2V1h-2zM5.5 7h1V3h-1zM6.5 6h1V4h-1z"
      />
    </svg>
  );
}
