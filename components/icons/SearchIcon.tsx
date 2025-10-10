import React from "react";

export function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="6"
      height="8"
      viewBox="0 0 6 8"
      {...props}
    >
      <path
        fill="currentColor"
        d="M5 1h1v4H5zM0 1h1v4H0zM1 0h4v1H1zM1 5h4v1H1zM2 6h2v2H2z"
      />
    </svg>
  );
}
