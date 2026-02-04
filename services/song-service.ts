import type { Song } from "@/models/song"

/**
* Shape of the full response returned by the iTunes Search API.
* We only care about the `results` array.
*/
type ItunesSearchResponse = {
  results: ItunesSong[]
}

/**
* Raw song object as returned by the iTunes API.
* This represents external data before it is mapped
* to the app's internal Song model.
*/
type ItunesSong = {
  trackId: number
  trackName: string
  artistName: string
  previewUrl: string
  artworkUrl100: string
}

/**
* Fetches songs from the iTunes Search API based on a search term.
* The external API data is mapped to the internal `Song` model
* used throughout the application.
*/
export async function getSongs(term: string): Promise<Song[]> {

  // Send a request to the iTunes Search API using the provided search term
  const response = await fetch(
    `https://itunes.apple.com/search?term=${
      term
    }&entity=song&limit=8`
  )

  // Throw an error if the request fails
  if (!response.ok) {
    throw new Error("Failed to fetch songs from iTunes API")
  }

  // Parse the JSON response
  const data: ItunesSearchResponse = await response.json()
  //console.log(data.results[0])

  // Map the raw iTunes data to the internal Song interface
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