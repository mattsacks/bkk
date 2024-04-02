import React from "react";

export function HeartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="7"
      height="6"
      viewBox="0 0 7 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        clipRule="evenodd"
        d="M3 0H1V1H0V3H1V4H2V5H3V6H4V5H5V4H6V3H7V1H6V0H4V1H3V0Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}
