/**
 * SEARCH BAR (Client Component)
 *
 * - Updates the URL client-side using the Next.js router.
 * - Does NOT fetch data itself.
 *
 * When submitted:
 * → The URL updates with ?term=value via router.push
 * → Next.js re-renders page.tsx without a full page reload,
 *   so playback in MusicPlayer isn't interrupted.
*/

"use client"

import { useRouter } from "next/navigation"

interface SearchBarProps {
  defaultValue?: string
}

export default function SearchBar({ defaultValue }: SearchBarProps) {
  const router = useRouter()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const term = new FormData(e.currentTarget).get("term") as string
    router.push(`/?term=${encodeURIComponent(term)}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto py-7 mb-10 flex items-stretch gap-2"
    >
      <label htmlFor="term" className="sr-only">
        Search songs
      </label>

      <input
        id="term"
        name="term"    /* IMPORTANT: becomes ?term=value in URL */
        type="text"
        autoComplete="off"    /* Prevents the browser's remembered-entries dropdown and inline suggestion, which render with colors our theme can't override */
        defaultValue={defaultValue}    /* Reflects current search */
        placeholder="Search for songs or artists…"
        className="flex-1 w-full rounded-xl px-6 py-2 text-[14px] bg-[var(--search-bg)] focus:outline-none focus:border border-[var(--current-border)]"
      />
    </form>
  )
}
