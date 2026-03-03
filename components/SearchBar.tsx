/**
 * SEARCH BAR (Server Component)
 *
 * - Updates the URL using a GET request.
 * - Does NOT manage state.
 * - Does NOT fetch data.
 *
 * When submitted:
 * → The browser updates the URL with ?term=value
 * → Next.js re-renders page.tsx on the server
*/

interface SearchBarProps {
  defaultValue?: string
}

export default function SearchBar({ defaultValue }: SearchBarProps) {
  return (
    <form
      action="/"       /* Submit to homepage */
      method="GET"         /* Use URL query parameters */
      className="max-w-md mx-auto py-7 mb-10 flex items-stretch gap-2"
    >
      <label htmlFor="term" className="sr-only">
        Search songs
      </label>

      <input
        id="term"
        name="term"    /* IMPORTANT: becomes ?term=value in URL */
        type="text"
        defaultValue={defaultValue}    /* Reflects current search */
        placeholder="Search for songs or artists…"
        className="flex-1 w-full rounded-xl px-4 py-2 text-[14px] bg-[#240B0B] focus:outline-none focus:border-yellow-700"
      />

    </form>
  )
}
