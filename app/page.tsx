import SearchBar from "@/components/search-bar";
import SongGrid from "@/components/song-grid";
import { getSongs } from "@/services/SongService";

export default async function Home() {
  const songs = await getSongs()

  return (
    <>
      <header className="px-13 bg-[#1d1d1d]">
        <SearchBar />
      </header>

      <main className="px-13 py-5">
        <SongGrid songs= { songs }/>
      </main>
    </>
  );
}
