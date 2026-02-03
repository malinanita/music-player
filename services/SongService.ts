import type { Song } from "@/models/song"

type ItunesSearchResponse = {
  results: ItunesSong[]
}

type ItunesSong = {
  trackId: number
  trackName: string
  artistName: string
  previewUrl: string
  artworkUrl100: string
}

export async function searchSongs(term: string): Promise<Song[]> {
  const response = await fetch(
    `https://itunes.apple.com/search?term=${encodeURIComponent(
      term
    )}&entity=song&limit=12`
  )

  if (!response.ok) {
    throw new Error("Failed to fetch songs from iTunes API")
  }

  const data: ItunesSearchResponse = await response.json()
  console.log(data.results[0])

  return data.results
    .filter((item) => item.previewUrl) // important! some of them doesn't have preview
    .map((item) => ({
      id: String(item.trackId),
      title: item.trackName,
      artist: item.artistName,
      audioUrl: item.previewUrl,
      coverUrl: item.artworkUrl100,
    }))
}