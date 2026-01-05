import dynamic from "next/dynamic";

import AppNav from "@/components/AppNav";
import Loading from "@/components/Loading";

const SongSearchPage = dynamic(() => import("@/components/SongSearchPage"), {
  // Uses locally backed state, defer to client-side rendering
  ssr: false,
  loading: () => (
    <>
      <AppNav />
      <div className="app-container flex flex-1 flex-col gap-gutter">
        <Loading className="flex-1" />
      </div>
    </>
  )
});

function Index() {
  return <SongSearchPage />;
}

export default Index;
