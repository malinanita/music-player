/**
 * SONG SERVICE (Data Layer)
 *
 * Responsible for:
 * - Communicating with the external iTunes API.
 * - Validating the response.
 * - Converting external data into the internal Song model.
 *
 * This isolates API structure from the rest of the app.
*/

import type { Song } from "@/models/song"

/**
* Shape of one song as returned by iTunes API.
* This is NOT the same as our internal Song type.
*/
type ItunesSong = {
  trackId: number
  trackName: string
  artistName: string
  previewUrl: string
  artworkUrl100: string
}

// Full API response structure. We only care about the "results" array.
type ItunesSearchResponse = {
  results: ItunesSong[]
}


export async function getSongs(term: string): Promise<Song[]> {

  // Send request to the iTunes Search API using the provided search term
  const response = await fetch(
    `https://itunes.apple.com/search?term=${term}&entity=song&limit=6`
  )

  if (!response.ok) {
    throw new Error("Failed to fetch songs from iTunes API")
  }

  // Parse the JSON response
  const data: ItunesSearchResponse = await response.json()

  /** 
   * Transform external API data into internal Song structure used in the UI
   * by mapping the raw iTunes data to the internal Song interface
  */
  return data.results
    .map((item) => ({
      id: String(item.trackId),
      title: item.trackName,
      artist: item.artistName,
      audioUrl: item.previewUrl,
      // Replace the default 100x100 artwork with a higher resolution version
      coverUrl: item.artworkUrl100.replace(
        "100x100bb.jpg",
        "600x600bb.jpg"
    ),
  }))
}