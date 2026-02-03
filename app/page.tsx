import SongGrid from "@/components/song-grid";
import { getSongs } from "@/services/SongService";

export default async function Home() {
  const songs = await getSongs()

  return (
    <main className="px-13 py-8">
      <h1 className="py-5 text-2xl font-bold">Music Player</h1>
      <SongGrid songs= { songs }/>
    </main>
  );
}
