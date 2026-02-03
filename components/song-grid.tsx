import { Song } from "@/models/song"
import SongCard from "./song-card"

export default function SongGrid( { songs }: { songs: Song[] } ) {
  return (
    <section>
      <ul className="grid grid-cols-3 gap-3">
        {songs.map((song) => (
          <li key={ song.id }>
            <SongCard song= { song }/>
          </li>
        ))}
      </ul>
    </section>
  )
}