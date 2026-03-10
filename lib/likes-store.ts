import type { Song } from "@/models/song"

const globalForLikes = globalThis as unknown as {
  likesStore: Map<string, Song>;
}

export const likesStore =
  globalForLikes.likesStore || new Map<string, Song>()

if (process.env.NODE_ENV !== "production") {
  globalForLikes.likesStore = likesStore
}

export function toggleLike(song: Song) {

  if (likesStore.has(song.id)) {
    likesStore.delete(song.id)
    return false
  } else {
    likesStore.set(song.id, song)
    return true
  }
}

export function getLikedSongs(): Song[] {
  return Array.from(likesStore.values())
}

export function isLiked(id: string) {
  return likesStore.has(id)
}