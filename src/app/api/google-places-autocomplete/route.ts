import { NextResponse, NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const searchParams = new URLSearchParams(req.nextUrl.searchParams)
  const query = searchParams.get("q")

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&language=pt_BR&key=${process.env.NEXT_GOOGLE_MAP_API_KEY}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
    const responseJson = await response.json()
    return NextResponse.json(responseJson)
  } catch (error) {
    console.error(error)
  }
}
