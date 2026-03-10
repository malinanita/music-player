"use server"

/**
 * Server Actions for likes
 *
 * These functions allow Client Components to interact
 * with the server-side likes store.
 */

import { toggleLike, isLiked } from "./likes-store"
import type { Song } from "@/models/song"

/**
 * Toggle like status for a song
 * - If the song is liked → remove like
 * - If the song is not liked → add like
 */
export async function toggleLikeAction(song: Song) {
  return toggleLike(song)
}

/**
 * Check if a song is liked
 */
export async function isLikedAction(id: string) {
  return isLiked(id)
}