import React from "react";

export function SkipIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      height="10"
      viewBox="0 0 10 10"
      {...props}
    >
      <g fill="currentColor" clipPath="url(#a)">
        <path d="M1 9h1V1H1zM2 8h1V2H2zM3 7h1V3H3zM4 6h1V4H4zM5 9h1V1H5zM6 8h1V2H6zM7 7h1V3H7zM8 6h1V4H8z" />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="currentColor" d="M1 1h8v8H1z" />
        </clipPath>
      </defs>
    </svg>
  );
}
