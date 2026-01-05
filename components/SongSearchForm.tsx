// Input that filters a list of songs
import debounce from "lodash/debounce";
import { useEffect, useMemo, useRef, useState } from "react";

interface SongSearchFormProps {
  /** When the user changes the search input. */
  onSearchChange: (query?: string) => void;
  /** When the user submits a change. */
  onSubmit: (query?: string) => void;
  /** The latest query that's been preserved in storage. */
  lastQuery?: string;
}

export function SongSearchForm({
  onSearchChange,
  onSubmit,
  lastQuery
}: SongSearchFormProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const prevLastQueryRef = useRef(lastQuery);

  const [hasSearchInput, setHasSearchInput] = useState(!!lastQuery);

  const debouncedSubmit = useMemo(
    () => debounce((query: string) => onSubmit(query), 1500),
    [onSubmit]
  );

  useEffect(() => {
    return () => debouncedSubmit.cancel();
  }, [debouncedSubmit]);

  // Sync input value when lastQuery changes externally (i.e, prefilling input)
  // but don't control it during normal typing
  useEffect(() => {
    if (lastQuery !== prevLastQueryRef.current) {
      prevLastQueryRef.current = lastQuery;

      if (inputRef.current && inputRef.current.value !== lastQuery) {
        inputRef.current.value = lastQuery ?? "";
      }

      setHasSearchInput(Boolean(lastQuery));
    }
  }, [lastQuery]);

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();

        inputRef.current?.blur();

        debouncedSubmit.cancel();

        const query = inputRef.current?.value || "";
        onSubmit(query);
      }}
    >
      <div className="outlined-input flex w-full">
        <input
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          className="input w-full"
          defaultValue={lastQuery || ""}
          enterKeyHint="search"
          id="song-search-input"
          name="search"
          onChange={(e) => {
            // Replace any smart quotes with regular ones
            const query = e.target.value
              .replace(/[\u2018\u2019]/g, "'")
              .replace(/[\u201C\u201D]/g, '"');

            setHasSearchInput(Boolean(query));
            onSearchChange(query);
            debouncedSubmit(query);
          }}
          placeholder="search songz"
          ref={inputRef}
          type="search"
        />
        {hasSearchInput && (
          <button
            aria-label="clear search"
            aria-controls="song-search-input"
            className="search-clear remove-line-height"
            onClick={() => {
              if (inputRef.current) {
                inputRef.current.value = "";
              }

              debouncedSubmit.cancel();

              setHasSearchInput(false);
              onSearchChange("");
              onSubmit("");

              inputRef.current?.focus();

              setTimeout(() => {
                window.scrollTo(0, 0);
              }, 100);
            }}
            type="button"
          >
            x
          </button>
        )}
      </div>
    </form>
  );
}
