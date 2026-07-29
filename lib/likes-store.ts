import type { Song } from "@/models/song"

const STORAGE_KEY = "liked-songs"

function readLikedSongs(): Song[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? JSON.parse(raw) : []
}

function writeLikedSongs(songs: Song[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(songs))
}

export function toggleLike(song: Song): boolean {
  const songs = readLikedSongs()
  const isCurrentlyLiked = songs.some((s) => s.id === song.id)

  if (isCurrentlyLiked) {
    writeLikedSongs(songs.filter((s) => s.id !== song.id))
    return false
  }

  writeLikedSongs([...songs, song])
  return true
}

export function getLikedSongs(): Song[] {
  return readLikedSongs()
}

export function isLiked(id: string): boolean {
  return readLikedSongs().some((s) => s.id === id)
}