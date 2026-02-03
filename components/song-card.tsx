import Image from "next/image"
import { Song } from "@/models/song"

export default function SongCard( { song }: { song: Song }) {
  return (
    <article key={song.id}>
      <h2 className="font-bold">{song.title}</h2>
      <p>{song.artist}</p>
      <Image 
        src={song.coverUrl ?? "/images/placeholder.jpg"} 
        alt=""
        width={300}
        height={300}
        className="w-80 h-80 object-cover"
      />
    </article>
  )
}