import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  Dispatch,
  SetStateAction
} from "react";
import Cookies from "js-cookie";
import { GlobalState, USER_COOKIE } from "lib/types";

interface GlobalStateProviderT {
  globalState: GlobalState;
  // FIXME: Use dynamic value from useState
  setGlobalState: Dispatch<SetStateAction<GlobalState>>;
  /* setGlobalState: ReturnType<typeof useState<GlobalState>>; */
}

export const GlobalStateContext = createContext<GlobalStateProviderT>(
  undefined
);

export function GlobalStateProvider({
  children
}: {
  children: React.ReactNode;
}) {
  // FIXME: Move initial state loading somewhere else?
  const token = Cookies.get(USER_COOKIE);

  const [globalState, setGlobalState] = useState<GlobalState>({
    songs: [],
    token,
    user: {}
  });

  return (
    <GlobalStateContext.Provider value={{ globalState, setGlobalState }}>
      {children}
    </GlobalStateContext.Provider>
  );
}

export default function useGlobalState() {
  return useContext(GlobalStateContext);
}

export function createGlobal<State>(
  token: keyof GlobalState,
  options: {
    updater?: (newState: State) => State;
  } = {}
) {
  const { updater } = options;

  return function(Component) {
    const MemoComponent = React.memo(Component);

    function WithGlobal(props) {
      const { globalState, setGlobalState } = useGlobalState();

      const selectedState = globalState[token];
      const setSelectedState = useCallback((newSelectedState) => {
        setGlobalState((prevGlobalState) => ({
          ...prevGlobalState,
          [token]: updater ? updater(newSelectedState) : newSelectedState
        }));
      }, []);

      const hookProps = {
        [token]: selectedState,
        [`set${token[0].toUpperCase() + token.slice(1)}`]: setSelectedState
      };

      return <MemoComponent {...props} {...hookProps} />;
    }

    WithGlobal.displayName = `with${token[0].toUpperCase() + token.slice(1)}`;

    return WithGlobal;
  };
}
