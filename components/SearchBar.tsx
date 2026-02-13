interface SearchBarProps {
  defaultValue?: string
}

export default function SearchBar({ defaultValue }: SearchBarProps) {
  return (
    <form
      action="/"
      method="GET"
      className="max-w-md mx-auto py-7 mb-10"
    >
      <label htmlFor="term" className="sr-only">
        Search songs
      </label>

      <input
        id="term"
        name="term"
        type="text"
        defaultValue={defaultValue}
        placeholder="Search for songs or artists…"
        className="w-full rounded-xl border px-4 py-2 text-lg"
      />
    </form>
  )
}
