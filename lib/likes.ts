// lib/likes-store.ts

/**
 * Simple in-memory like store.
 *
 * Stores likes in a Map on the server.
 * The data persists as long as the server process is running.
 * No database or API routes required.
 *
 * Key: songId
 * Value: number of likes
*/

const globalForLikes = globalThis as unknown as {
  likesStore: Map<string, number>;
};

export const likesStore =
  globalForLikes.likesStore || new Map<string, number>();

if (process.env.NODE_ENV !== "production") {
  globalForLikes.likesStore = likesStore;
}

// Returns the number of likes for a song.
export function getLikes(id: string) {
  return likesStore.get(id) || 0;
}

// Updates the number of likes for a song.
export function setLikes(id: string, likes: number) {
  likesStore.set(id, likes);
}

// Returns all liked song IDs.
export function getLikedSongIds() {
  return Array.from(likesStore.entries())
    .filter(([_, likes]) => likes > 0)
    .map(([id]) => id);
}