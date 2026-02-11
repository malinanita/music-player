
export default function SearchBar() {
  return (
    <form className="max-w-md mx-auto py-7 mb-10">
      <label htmlFor="search" className="sr-only">
        Search songs
      </label>

      <input
        id="search"
        type="text"
        placeholder="Search for songs or artists…"
        className="w-full rounded-xl border px-4 py-2 text-lg"
      />
    </form>
  )
}