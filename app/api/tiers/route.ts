import { NextResponse } from "next/server"

export async function GET() {
  // This is where you would typically fetch data from a database or external API
  // For now, we'll return static data
  const tiers = [
    {
      name: "Tier 4 - Emerald Hero",
      image: "/placeholder.svg?height=600&width=600",
      requirement: "Hold 1B $HODL for 30 days.",
      perk: "4 entries in the monthly raffle.",
    },
    {
      name: "Tier 3 - Ruby Hero",
      image: "/placeholder.svg?height=600&width=600",
      requirement: "Hold 2.5B $HODL for 30 days.",
      perk: "2 entries in the monthly raffle.",
    },
    {
      name: "Tier 2 - Sapphire Hero",
      image: "/placeholder.svg?height=600&width=600",
      requirement: "Hold 5B $HODL for 30 days.",
      perk: "1 entry in the monthly raffle.",
    },
    {
      name: "Tier 1 - Diamond Hero",
      image: "/placeholder.svg?height=600&width=600",
      requirement: "Hold 10B $HODL for 30 days.",
      perk: "Membership in the exclusive Diamond Heroes Network.",
    },
  ]

  return NextResponse.json(tiers)
}
