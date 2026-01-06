import { useDeferredValue } from "react";

interface SongSearchInputProps {
  /** Called when the input value changes */
  onChange: (value: string) => void;
  /** Called when the form is submitted */
  onSubmit: () => void;
  /** The controlled value of the input */
  value: string;
}

export function SongSearchInput({
  value,
  onChange,
  onSubmit
}: SongSearchInputProps) {
  // Use deferred value for responsive input while search processing happens
  const deferredValue = useDeferredValue(value);
  const hasSearchInput = Boolean(deferredValue);

  return (
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
          // Replace any smart quotes with regular ones
          const query = e.target.value
            .replace(/[\u2018\u2019]/g, "'")
            .replace(/[\u201C\u201D]/g, '"');

          onChange(query);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            e.currentTarget.blur();
            onSubmit();
          }
        }}
        placeholder="search songz"
        type="search"
        value={value}
      />
      {hasSearchInput && (
        <button
          aria-label="clear search"
          aria-controls="song-search-input"
          className="search-clear remove-line-height"
          onClick={() => {
            onChange("");

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
  );
}
