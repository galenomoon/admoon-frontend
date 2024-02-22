import React from "react"

import { getLatLng, getPlace } from "../requests/googleServices"
import { GoogleMap, MarkerF, LoadScriptNext } from "@react-google-maps/api"

interface GoogleMapsProps {
  latLng: {
    latitude: string
    longitude: string
  }

  onDragEnd: (res: {
    coords: { latitude: number; longitude: number }
    formatted_address: string
  }) => void
}

export default function GoogleMaps({ latLng, onDragEnd }: GoogleMapsProps) {
  const bounds = {
    lat: Number(latLng.latitude) || -23.533773,
    lng: Number(latLng.longitude) || -46.62529,
  }

  async function getGoogleMapsAddress({
    dragAndDropLatLng,
    isCurrentLocation,
    place_id,
  }: {
    dragAndDropLatLng?: { latitude: string; longitude: string }
    isCurrentLocation?: boolean
    place_id?: string
  }): Promise<{
    coords: {
      latitude: number
      longitude: number
    }
    isPermissionDenied: boolean,
    formatted_address: string
  }> {
    let res = {
      coords: {
        latitude: 0,
        longitude: 0,
      },
      isPermissionDenied: false,
      formatted_address: '',
    }

    if (isCurrentLocation) {
      navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
          res.coords = coords

          const { formatted_address } = await getPlace(coords) || {}
          res.formatted_address = formatted_address || ''
        },
        () => (res.isPermissionDenied = true),
      )
      return res
    }

    if (dragAndDropLatLng?.latitude) {
      res.coords = {
        latitude: Number(dragAndDropLatLng.latitude),
        longitude: Number(dragAndDropLatLng.longitude),
      }
    }
    if (place_id) {
      res.coords = await getLatLng(place_id)
    }

    const { formatted_address } = await getPlace(res.coords) || {}
    res.formatted_address = formatted_address || ''
    return res
  }

  return (
    <LoadScriptNext
      googleMapsApiKey={process.env.NEXT_GOOGLE_MAP_API_KEY || ""}
      libraries={["places"]}
    >
      <GoogleMap
        zoom={15}
        center={bounds}
        mapContainerStyle={{
          margin: 0,
          padding: 0,
          width: "100%",
          height: "100%",
          minHeight: "300px",
          borderRadius: "10px",
          filter: `blur(0px)`,
          display: "flex",
        }}
        options={{
          zoomControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        }}
      >
        <MarkerF
          position={bounds}
          draggable={true}
          onDragEnd={async ({ latLng }) => {
            const dragAndDropLatLng = {
              latitude: `${latLng?.lat?.() || 0}`,
              longitude: `${latLng?.lng?.() || 0}`,
            }
            const res = await getGoogleMapsAddress({ dragAndDropLatLng })
            onDragEnd(res)
          }}
        />
      </GoogleMap>
    </LoadScriptNext>
  )
}
