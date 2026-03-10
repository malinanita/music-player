// lib/likes-store.ts

/**
 * Simple in-memory like store.
 *
 * Stores likes in a Map on the server.
 * The data persists as long as the server process is running.
 * No database or API routes required.
 *
 * Key: songId
 * Value: 1 (liked)
*/

const globalForLikes = globalThis as unknown as {
  likesStore: Map<string, number>;
};

export const likesStore =
  globalForLikes.likesStore || new Map<string, number>();

if (process.env.NODE_ENV !== "production") {
  globalForLikes.likesStore = likesStore;
}

// Returns 1 if a song is liked, otherwise 0
export function getLikes(id: string) {
  return likesStore.get(id) || 0;
}

export function toggleLike(id: string) {
  const current = getLikes(id)

  if (current > 0) {
    likesStore.delete(id)
    return 0
  } else {
    likesStore.set(id, 1)
    return 1
  }
}

// Returns all liked song IDs
export function getLikedSongIds() {
  return Array.from(likesStore.keys());
}

