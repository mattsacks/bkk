import dynamic from "next/dynamic";

/**
 * Prevents a component from rendering on the server.
 */
export default dynamic(
  () => {
    return Promise.resolve((props: React.PropsWithChildren) => {
      return <>{props.children}</>;
    });
  },
  {
    ssr: false
  }
);
