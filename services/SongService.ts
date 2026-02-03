import type { Song } from "@/models/song"

export async function getSongs(): Promise<Song[]> {
  return [
    {
      id: "1",
      title: "The Great Divide",
      artist: "Noah Kahan",
      audioUrl: "/audio/the-great-divide.mp3",
    },
    {
      id: "2",
      title: "So Young",
      artist: "Portugal. The Man",
      audioUrl: "/audio/dreams.mp3",
    },
  ]
}