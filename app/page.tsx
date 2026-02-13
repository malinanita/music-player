/**
* HOME PAGE (Server Component)
*
* Flow:
* 1. Reads the current search term from the URL.
* 2. Fetches matching songs from the iTunes API.
* 3. Sends the fetched songs to the client-side MusicPlayer.
*
* This component:
* - Does NOT use useState.
* - Does NOT handle UI interaction.
* - Only handles navigation state + data fetching.
* 
*/

import SearchBar from "@/components/SearchBar";
import { getSongs } from "@/services/song-service";
import MusicPlayer from "@/components/MusicPlayer";

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
    <>
      <header className="px-13 bg-[#1d1d1d]">
        <SearchBar defaultValue={term} />
      </header>

      <main className="px-13 py-5 pb-28">
        <MusicPlayer songs={songs} />
      </main>
    </>
  )
}
