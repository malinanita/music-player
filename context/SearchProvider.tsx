/**
* Global search-term memory.
*
* - Stores the most recently searched term in React state.
* - Restores it from sessionStorage after reloads within the current
*   browser session.
* - Makes lastTerm and setLastTerm available through React Context so
*   layout-level components (which never remount on navigation) can stay
*   in sync with whatever the Home page is currently showing.
*
* Components such as SearchBar and PlayBar use the useSearch hook to
* read or update the remembered term.
*
* This provider is mounted in the root layout so search state can be
* shared across pages.
*/

"use client"

import { createContext, useContext, useState, useEffect } from "react"

type SearchContextType = {
  lastTerm: string
  setLastTerm: (term: string) => void
}

const SearchContext = createContext<SearchContextType | null>(null)

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [lastTerm, setLastTermState] = useState("")

  useEffect(() => {
    const savedTerm = sessionStorage.getItem("last-search-term")

    if (savedTerm !== null) {
      setLastTermState(savedTerm)
    }
  }, [])

  function setLastTerm(term: string) {
    setLastTermState(term)
    sessionStorage.setItem("last-search-term", term)
  }

  return (
    <SearchContext.Provider value={{ lastTerm, setLastTerm }}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (!context) throw new Error("useSearch must be used inside SearchProvider")
  return context
}
