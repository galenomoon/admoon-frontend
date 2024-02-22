import axios from "axios"

export async function getLatLng(placeId: string) {
  if (!placeId) return console.error("No placeId provided")
  const API_ENDPOINT =
    "https://maps.googleapis.com/maps/api/geocode/json?place_id="
  const API_VALIDATION = "&key=" + process.env.NEXT_GOOGLE_MAP_API_KEY
  const data = await axios.get(`${API_ENDPOINT}${placeId}${API_VALIDATION}`)
  const location = data.data.results?.[0].geometry.location
  const response = {
    ...location,
    latitude: location.lat,
    longitude: location.lng,
  }
  return response
}

export async function getPlace(latLng: {
  latitude: number
  longitude: number
}): Promise<{
  address_components: Array<{
    long_name: string
    short_name: string
    types: Array<string>
  }>
  formatted_address: string
  place_id: string
} | null> {
  if (!latLng) {
    console.error("No latLng provided")
    return null
  }
  const API_ENDPOINT =
    "https://maps.googleapis.com/maps/api/geocode/json?latlng="
  const API_VALIDATION = "&key=" + process.env.NEXT_GOOGLE_MAP_API_KEY
  const response = await axios.get(
    `${API_ENDPOINT}${latLng.latitude},${latLng.longitude}${API_VALIDATION}`,
  )
  return response.data.results?.[0]
}
