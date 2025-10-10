import cntl from "cntl";

export const submit = cntl`
  bg-accent
  cursor-pointer
  duration-200
  ease-in-out
  mt-6
  p-2
  text-background
  transition-opacity;
`;

export const submitWide = cntl`
  ${submit}
  px-6
`;
