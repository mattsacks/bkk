// Input that filters a list of songs
import { useRef } from "react";

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

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();

        inputRef.current?.blur();

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
              if (inputRef.current) {
                inputRef.current.value = "";
              }

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
