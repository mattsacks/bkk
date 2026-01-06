import { SongSearchInput } from "@/components/SongSearchInput";

interface SongSearchFormProps {
  /** The controlled value of the input */
  value: string;
  /** When the user changes the search input. */
  onChange: (query: string) => void;
  /** When the user submits a change. */
  onSubmit: () => void;
}

export function SongSearchForm({
  value,
  onChange,
  onSubmit
}: SongSearchFormProps) {
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <SongSearchInput value={value} onChange={onChange} onSubmit={onSubmit} />
    </form>
  );
}
