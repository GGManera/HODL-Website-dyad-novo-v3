import { NextResponse } from "next/server"

const BLOCKDAEMON_BASE_URL = "https://svc.blockdaemon.com/algorand/mainnet/native/indexer/v2"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const assetId = searchParams.get("assetId")

  if (!assetId) {
    return NextResponse.json({ error: "Asset ID is required" }, { status: 400 })
  }

  try {
    const response = await fetch(`${BLOCKDAEMON_BASE_URL}/assets/${assetId}/balances`, {
      headers: {
        Authorization: `Bearer ${process.env.BLOCKDAEMON_API_KEY}`,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching asset balances:", error)
    return NextResponse.json({ error: "Failed to fetch asset balances" }, { status: 500 })
  }
}
