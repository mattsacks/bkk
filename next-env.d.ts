/// <reference types="next" />
/// <reference types="next/types/global" />

declare module "*.scss" {
  const content: { [className: string]: string };
  export = content;
}

declare module "*.svg" {
  const content: unknown;
  export default content;
}
