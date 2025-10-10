import React from "react";

export function MusicNoteIcon(props: React.SVGProps<SVGSVGElement>) {
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
        d="M0 5h1v3H0zM5 5h1v3H5zM2 6h1v1H2zM7 6h1v1H7zM1 7h2v1H1z"
      />
      <path
        fill="currentColor"
        d="M5 7h3v1H5zM1 5h1v2H1zM6 5h1v2H6zM2 0h1v6H2zM7 0h1v6H7zM3 0h2v1H3zM3 2h4v1H3zM5 0h2v1H5z"
      />
    </svg>
  );
}
