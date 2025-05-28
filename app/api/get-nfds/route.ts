import { NextResponse } from "next/server"

const NFD_API_URL = "https://api.nf.domains/nfd/lookup"
const BATCH_SIZE = 10 // Reduce batch size to avoid 400 errors

export async function GET(request: Request) {
  console.log("GET /api/get-nfds called")
  const { searchParams } = new URL(request.url)
  const addresses = searchParams.get("addresses")

  if (!addresses) {
    return NextResponse.json({ error: "No addresses provided" }, { status: 400 })
  }

  try {
    const addressList: string[] = addresses.split(",")
    console.log("Total addresses to fetch:", addressList.length)

    // Split addresses into batches
    const batches = []
    for (let i = 0; i < addressList.length; i += BATCH_SIZE) {
      batches.push(addressList.slice(i, i + BATCH_SIZE))
    }

    // Process each batch
    const results = {}
    for (const batch of batches) {
      const apiUrl = `${NFD_API_URL}?${batch.map((addr) => `address=${addr}`).join("&")}`
      console.log("Fetching batch of", batch.length, "addresses")

      const response = await fetch(apiUrl)
      console.log("NFD API Response status:", response.status)

      if (response.ok) {
        const data = await response.json()
        Object.assign(results, data)
      } else {
        console.log("Batch request failed with status:", response.status)
      }
    }

    console.log("Total NFDs found:", Object.keys(results).length)
    return NextResponse.json({ nfds: results })
  } catch (error) {
    console.error("Error fetching NFDs:", error)
    return NextResponse.json({ error: "Failed to fetch NFDs" }, { status: 500 })
  }
}
