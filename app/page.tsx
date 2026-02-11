import SearchBar from "@/components/SearchBar";
import SongGrid from "@/components/SongGrid";
import { getSongs } from "@/services/song-service";
import BottomBar from "@/components/BottomBar";

export default async function Home() {
  const songs = await getSongs("Portugal. The Man")

  return (
    <>
      <header className="px-13 bg-[#1d1d1d]">
        <SearchBar />
      </header>

      <main className="px-13 py-5">
        <SongGrid songs= { songs }/>
      </main>

      <footer>
        <BottomBar song={songs[0]} /> {/* Temporary: hardcoded first song as the current song */}
      </footer>
    </>
  );
}
