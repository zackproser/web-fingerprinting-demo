import { NextResponse } from "next/server"
import { initDatabase, getFingerprints, getFingerprintCount, getStorageType } from "@/lib/db"

export async function GET() {
  try {
    // Initialize the database if needed
    await initDatabase()

    // Get all fingerprints (including older ones)
    const fingerprints = await getFingerprints(300000) // 5 minutes

    // Get the count of fingerprints
    const count = await getFingerprintCount()
    const storageType = getStorageType()

    // Return debug info
    return NextResponse.json({
      count,
      storageType,
      fingerprints: fingerprints.map((fp) => ({
        id: fp.id.substring(0, 8) + "...",
        moniker: fp.moniker,
        timestamp: new Date(fp.timestamp).toISOString(),
        browser: fp.details.browser,
        os: fp.details.os,
      })),
    })
  } catch (error) {
    console.error("Error in debug endpoint:", error)
    return NextResponse.json({ error: "Debug error", details: (error as Error).message }, { status: 500 })
  }
}

