export const dynamic = "force-dynamic"

import { getLikedSongs } from "@/lib/likes-store"
import SongCard from "@/components/SongCard"

export default function LikesPage() {

  const likedSongs = getLikedSongs()

  return (
    <main className="p-10">
      <h1 className="text-3xl mb-6">Liked Songs</h1>

      {likedSongs.length === 0 ? (
        <p className="text-zinc-400">
          You haven't liked any songs yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {likedSongs.map(song => (
            <SongCard
              key={song.id}
              song={song}
            />
          ))}
        </div>
      )}
    </main>
  )
}