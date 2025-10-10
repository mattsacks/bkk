import React from "react";

export function QueueIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="8"
      height="8"
      viewBox="0 0 8 8"
      {...props}
    >
      <path
        fill="currentColor"
        d="M0 0h4v2H0zM0 3h4v2H0zM0 6h4v2H0zM6 2h1v4H6zM5 1h1v6H5zM7 3h1v2H7z"
      />
      <path fill="currentColor" d="M7 4h1v1H7z" />
    </svg>
  );
}
