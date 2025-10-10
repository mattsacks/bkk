// Input that filters a list of songs
import debounce from "lodash/debounce";
import { useMemo, useRef } from "react";

interface SongSearchProps {
  onSearch: (query?: string) => void;
}

function SongSearch({ onSearch }: SongSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const searchQuery = inputRef.current?.value;

  const debouncedSearchSongs = useMemo(() => {
    return debounce(onSearch, 333);
  }, [onSearch]);

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();

        const query = inputRef.current?.value;
        inputRef.current?.blur();

        onSearch(query);
      }}
    >
      <div className="outlined-input flex w-full">
        <input
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          className="input w-full"
          enterKeyHint="search"
          id="song-search-input"
          name="search"
          onChange={(e) => {
            e.persist();

            // Replace any smart quotes with regular ones
            const query = e.target.value
              .replace(/[\u2018\u2019]/g, "'")
              .replace(/[\u201C\u201D]/g, '"');

            e.target.value = query;

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
              onSearch();

              if (inputRef.current) {
                inputRef.current.value = "";
                inputRef.current.focus();

                setTimeout(() => {
                  window.scrollTo(0, 0);
                }, 100);
              }
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

export default SongSearch;
