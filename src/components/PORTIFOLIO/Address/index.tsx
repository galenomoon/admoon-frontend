import React, { use, useContext, useEffect, useState } from "react"

//components
import Button from "@/components/Button"
import GoogleMaps from "../GoogleMapsPack/GoogleMaps"
import GooglePlacesAutocomplete from "../GoogleMapsPack/GooglePlacesAutocomplete"

//config
import api_client from "@/config/api_client"

//context
import { WebsiteContext } from "@/contexts/websiteContext"
import toast from "react-hot-toast"

export default function Address() {
  const { currentWebsite, getCurrentWebsite } = useContext(WebsiteContext)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [currentAddress, setCurrentAddress] = useState({
    formatted_address: "",
    coords: { latitude: "", longitude: "" },
  })

  useEffect(() => {
    getAddress()
  }, [currentWebsite])

  useEffect(() => {
    compareAddresses()
  }, [currentWebsite, currentAddress])

  function compareAddresses() {
    const { latitude: preventLat, longitude: preventLng } =
      currentWebsite?.address?.[0] || {}

    const { latitude, longitude } = currentAddress.coords

    const currentAddressAreEqual =
      preventLat === latitude && preventLng === longitude

    setHasSubmitted(currentAddressAreEqual)
  }

  async function getAddress() {
    try {
      if (!currentWebsite) return
      const { data } = await api_client.get(
        `/websites/${currentWebsite.id}/address`,
      )
      setCurrentAddress({
        formatted_address: data.fullAddress,
        coords: {
          latitude: data.latitude,
          longitude: data.longitude,
        },
      })
    } catch (error) {
      console.error(error)
    }
  }

  async function submitAddress() {
    try {
      const {
        formatted_address,
        coords: { latitude, longitude },
      } = currentAddress

      const payload = {
        fullAddress: formatted_address,
        latitude,
        longitude,
      }

      const method = currentWebsite?.address?.[0]?.id ? "put" : "post"
      const endpoint = currentWebsite?.address?.length
        ? `/websites/${currentWebsite.id}/address/${currentWebsite.address?.[0]?.id}`
        : `/websites/${currentWebsite.id}/address`

      await api_client[method](endpoint, payload)
      await getCurrentWebsite()

      setHasSubmitted(true)
      toast.success("Endereço cadastrado com sucesso")
    } catch (error) {
      console.error(error)
      toast.error("Erro ao cadastrar endereço")
    }
  }

  return (
    <>
      <main className="relative flex h-full w-full flex-col gap-6">
        <h1 className="font-satoshi-medium text-3xl sm:hidden md:block">
          Endereço
        </h1>
        <br />
        <div className="text-typography-main relative flex h-[75vh] flex-col overflow-hidden rounded-xl bg-white pb-2 shadow-lg sm:max-w-[100dvw] md:max-w-full">
          <header className="h-[68px] w-full  items-center justify-between bg-white p-4 sm:hidden md:flex">
            <p className="text-typography-main font-satoshi-semibold text-xl">
              Defina aqui um endereço para ser exibido no seu site
            </p>
            <br />
            <Button
              onClick={submitAddress}
              disabled={!currentAddress.formatted_address || hasSubmitted}
            >
              Cadastrar Enderço
            </Button>
          </header>
          <div className="m-2 sm:flex md:hidden"></div>
          <section className="scrollbar-hide h-full w-full">
            <nav className="font-satoshi-medium sticky top-0 z-20 flex flex-col shadow-sm sm:pb-0 md:pb-0">
              <header className="flex w-full justify-between gap-3 bg-white/60 p-3 backdrop-blur-md">
                <GooglePlacesAutocomplete
                  onSelect={(address) => setCurrentAddress(address)}
                />
              </header>
            </nav>
            <section className="flex h-full flex-col gap-2 p-4">
              {currentAddress.formatted_address ? (
                <div className="flex items-baseline gap-3">
                  <p className="font-satoshi-medium text-typography-main">
                    Endereço atual:
                  </p>
                  <span className="font-satoshi-regular opacity-60">
                    {currentAddress.formatted_address}
                  </span>
                </div>
              ) : null}
              <section className="flex h-[85%] w-full flex-col gap-2 bg-gray-300">
                <GoogleMaps
                  latLng={currentAddress.coords}
                  onDragEnd={({ coords, formatted_address }) => {
                    setCurrentAddress({
                      formatted_address,
                      coords: {
                        latitude: coords.latitude.toString(),
                        longitude: coords.longitude.toString(),
                      },
                    })
                  }}
                />
              </section>
            </section>
          </section>
        </div>
      </main>
    </>
  )
}
