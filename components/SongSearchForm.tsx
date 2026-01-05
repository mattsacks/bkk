// Input that filters a list of songs
import debounce from "lodash/debounce";
import { useMemo, useRef } from "react";

interface SongSearchFormProps {
  onSearch: (query?: string) => void;
  onSubmit: (query?: string) => void;
  searchQuery?: string;
}

export function SongSearchForm({
  onSearch,
  onSubmit,
  searchQuery
}: SongSearchFormProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedSearchSongs = useMemo(() => {
    return debounce(onSearch, 333);
  }, [onSearch]);

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();

        inputRef.current?.blur();

        onSubmit(searchQuery);
      }}
    >
      <div className="outlined-input flex w-full">
        <input
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          className="input w-full"
          value={searchQuery || ""}
          enterKeyHint="search"
          id="song-search-input"
          name="search"
          onChange={(e) => {
            // Replace any smart quotes with regular ones
            const query = e.target.value
              .replace(/[\u2018\u2019]/g, "'")
              .replace(/[\u201C\u201D]/g, '"');

            onSearch(query);
            debouncedSearchSongs(query);
          }}
          placeholder="search songz"
          ref={inputRef}
          type="search"
        />
        {searchQuery && (
          <button
            aria-label="clear search"
            aria-controls="song-search-input"
            className="search-clear remove-line-height"
            onClick={() => {
              onSearch("");

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
