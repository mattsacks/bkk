import React from "react";

export function RepeatIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      height="10"
      viewBox="0 0 10 10"
      {...props}
    >
      <g fill="currentColor" clipPath="url(#a)">
        <path d="M1 5h8V3H1zM7 9h2V5H7zM5 9h2V7H5zM2 6h2V5H2zM3 7h1V6H3zM3 2h1V1H3zM2 3h2V2H2z" />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="currentColor" d="M1 1h8v8H1z" />
        </clipPath>
      </defs>
    </svg>
  );
}
