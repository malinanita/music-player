/**
 * Server component for the home page.
 *
 * - Fetches songs from the iTunes API (via song-service).
 * - Passes the data to the MusicPlayer client component.
 *
 * This component is responsible only for data fetching,
 * not UI interaction or state management.
 */

import SearchBar from "@/components/SearchBar";
import { getSongs } from "@/services/song-service";
import MusicPlayer from "@/components/MusicPlayer";

export default async function Home() {
  const songs = await getSongs("Portugal. The Man")

  return (
    <>
      <header className="px-13 bg-[#1d1d1d]">
        <SearchBar />
      </header>

      <main className="px-13 py-5">
        <MusicPlayer songs= { songs }/>
      </main>

    </>
  );
}
