/**
* HOME PAGE (Server Component)
*
* Flow:
* 1. Reads the search term from the URL parameters.
* 2. Fetches matching songs from the iTunes API.
* 3. Passes the songs to the SongGrid component for display.
*
* This component is responsible only for:
* - Navigation state
* - Data fetching
* 
* It does not handle playback or interactivity.
* Song selection and playback are handled by the PlayerProvider and MusicPlayer.
*/

import SearchBar from "@/components/SearchBar";
import { getSongs } from "@/services/song-service";
import SongGrid from "@/components/SongGrid";

type PageProps = {
  searchParams: Promise<{
    term?: string
  }>
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams
  const term = params.term || ""

  //console.log("Search term:", term)

  const songs = await getSongs(term)

  return (
    <main className="md:ml-100 px-4 md:px-13 py-20 md:py-5 pb-28 md:pb-5">
      <SearchBar defaultValue={term} />
      <SongGrid songs={songs} />
    </main>
    
  )
}
