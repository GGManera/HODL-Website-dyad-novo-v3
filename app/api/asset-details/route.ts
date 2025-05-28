import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const assetId = request.nextUrl.searchParams.get("assetId")

  if (!assetId) {
    return NextResponse.json({ error: "Asset ID is required" }, { status: 400 })
  }

  try {
    // Instead of using Prisma, we'll fetch from an external API
    const metadataResponse = await fetch(`https://mainnet.api.perawallet.app/v1/public/assets/${assetId}/`, {
      next: { revalidate: 300 },
    })

    if (!metadataResponse.ok) {
      throw new Error(`HTTP error! status: ${metadataResponse.status}`)
    }

    const metadata = await metadataResponse.json()

    // Process the metadata similar to how we did before
    let tier = "Unknown"
    let gemValue = "Unknown"
    let month = "Unknown"

    if (metadata.collectible && metadata.collectible.traits) {
      const tierTrait = metadata.collectible.traits.find((trait: any) =>
        trait.display_name.toLowerCase().includes("tier"),
      )
      const gemTrait = metadata.collectible.traits.find((trait: any) =>
        trait.display_name.toLowerCase().includes("gem"),
      )
      const monthTrait = metadata.collectible.traits.find((trait: any) =>
        trait.display_name.toLowerCase().includes("month"),
      )

      if (tierTrait) tier = `Tier ${tierTrait.display_value}`
      if (gemTrait) gemValue = gemTrait.display_value
      if (monthTrait) month = monthTrait.display_value
    }

    return NextResponse.json({
      asset: {
        ...metadata,
        tier,
        gemValue,
        month,
        image_url: metadata.image || metadata.collectible?.metadata?.image,
        name: metadata.name,
        description: metadata.description || metadata.collectible?.description,
      },
    })
  } catch (error) {
    console.error("Error fetching asset details:", error)
    return NextResponse.json({ error: "Failed to fetch asset details" }, { status: 500 })
  }
}
