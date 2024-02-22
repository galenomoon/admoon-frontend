"use client"
import React, { useEffect, useState } from "react"

//components
import SearchBar from "@/components/SearchBar"

//styles
import { MapPin } from "@phosphor-icons/react"

//hooks
import { useDebounce } from "@/hooks/useDebounce"
import { getLatLng, getPlace } from "../requests/googleServices"

interface GooglePlacesAutocompleteProps {
  onSelect?: ({
    formatted_address,
    coords,
  }: {
    formatted_address: string
    coords: { latitude: string; longitude: string }
  }) => void
}

export default function GooglePlacesAutocomplete({
  onSelect,
}: GooglePlacesAutocompleteProps) {
  const [suggestions, setSuggestions] = useState([])
  const [isAddressListVisible, setIsAddressListVisible] = useState(false)
  const [value, setValue] = useState("")
  const debounceSearch = useDebounce(value as string, 300)

  useEffect(() => {
    if (suggestions.length) {
      setIsAddressListVisible(true)
    }
  }, [suggestions.length])

  useEffect(() => {
    getGoogleResponseFromNextApi()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceSearch])

  async function getGoogleResponseFromNextApi() {
    if (!debounceSearch.length) {
      return setIsAddressListVisible(false)
    }

    const query = debounceSearch

    const res = await fetch(`/api/google-places-autocomplete?q=${query}`)
    const data = await res.json()
    setSuggestions(data.predictions)
  }

  async function handleSelectAddress(suggestion: {
    description: string
    place_id: string
  }) {
    setValue(suggestion.description)
    setIsAddressListVisible(false)
    if (onSelect) {
      try {
        const res = await onSelectAnAddress(suggestion.place_id)
        onSelect(res as any)
      } catch (error) {
        console.error(error)
      }
    }
  }

  async function onSelectAnAddress(place_id: string) {
    const coords = await getLatLng(place_id)
    const { formatted_address } = (await getPlace(coords)) || {}

    return {
      coords,
      formatted_address,
    }
  }

  return (
    <div className="relative flex w-full flex-col items-center">
      <SearchBar
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="!bg-gray-100 shadow-none"
        placeholder="Insira seu endereço para ver os restaurantes mais próximos"
      />
      {suggestions?.length && isAddressListVisible ? (
        <nav className="absolute top-10 z-[33] flex w-[95%] flex-col gap-2 overflow-hidden rounded-b-xl border-[1px] border-gray-100 bg-white">
          {suggestions?.map(
            (
              suggestion: unknown & {
                place_id: string
                description: string
              },
            ) => (
              <ul
                onClick={() => handleSelectAddress(suggestion)}
                key={suggestion.place_id}
                className="group flex w-full cursor-pointer items-center gap-2 border-l-4 border-transparent bg-white p-2 text-start text-sm duration-100 last:pb-3 hover:border-primary hover:bg-primary/5 hover:text-primary"
              >
                <MapPin
                  size={18}
                  className="text-typography-light/40 flex-shrink-0 group-hover:text-primary"
                  weight="duotone"
                />
                <p>{suggestion.description}</p>
              </ul>
            ),
          )}
        </nav>
      ) : null}
    </div>
  )
}
