export const dynamic = "force-dynamic"

import { getLikedSongs } from "@/lib/likes-store"
import SongGrid from "@/components/SongGrid"

export default function LikesPage() {

  const likedSongs = getLikedSongs()

  return (
    <main className="md:ml-100 px-4 md:px-13 py-20 md:py-10 pb-28 md:pb-5">
      <section className="max-w-5xl mx-auto mb-6">
        <h1 className="text-3xl mb-6">Liked Songs</h1>
      </section>

      {likedSongs.length === 0 ? (
        <p className="text-zinc-400">
          You haven't liked any songs yet.
        </p>
      ) : (
        <SongGrid songs={likedSongs} />
      )}
    </main>
  )
}