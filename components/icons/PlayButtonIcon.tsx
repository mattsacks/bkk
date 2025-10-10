import React from "react";

export function PlayButtonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="8"
      height="8"
      viewBox="0 0 8 8"
      {...props}
    >
      <path fill="currentColor" d="M4 2H3V6H4V2Z" />
      <path fill="currentColor" d="M1 7H7V8H1V7Z" />
      <path fill="currentColor" d="M1 0H7V1H1V0Z" />
      <path fill="currentColor" d="M0 1H1V7H0V1Z" />
      <path fill="currentColor" d="M7 1H8V7H7V1Z" />
      <path fill="currentColor" d="M4 3H5V5H4V3Z" />
      <path fill="currentColor" d="M6 6H7V7H6V6Z" />
      <path fill="currentColor" d="M1 6H2V7H1V6Z" />
      <path fill="currentColor" d="M1 1H2V2H1V1Z" />
      <path fill="currentColor" d="M6 1H7V2H6V1Z" />
      <path fill="currentColor" d="M-2 9H-1V10H-2V9Z" />
    </svg>
  );
}
