import { type NextRequest, NextResponse } from "next/server"
import {
  initDatabase,
  addFingerprint,
  getFingerprints,
  cleanOldFingerprints,
  getFingerprintCount,
  getStorageType,
} from "@/lib/db"

// Maximum age for fingerprints (2 minutes)
const MAX_AGE_MS = 120000

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function POST(request: NextRequest) {
  try {
    // Initialize the database if needed
    await initDatabase()

    // Parse the fingerprint from the request
    const fingerprint = await request.json()

    // Store the fingerprint
    const success = await addFingerprint(fingerprint)

    if (!success) {
      throw new Error("Failed to store fingerprint")
    }

    // Clean up old fingerprints
    await cleanOldFingerprints(MAX_AGE_MS)

    // Get the count of fingerprints
    const count = await getFingerprintCount()
    const storageType = getStorageType()

    // Return success
    return NextResponse.json(
      {
        success: true,
        count,
        storageType,
      },
      { headers: corsHeaders },
    )
  } catch (error) {
    console.error("Error storing fingerprint:", error)
    return NextResponse.json(
      { error: "Failed to store fingerprint", details: (error as Error).message },
      { status: 500, headers: corsHeaders },
    )
  }
}

export async function GET() {
  try {
    // Initialize the database if needed
    await initDatabase()

    // Clean up old fingerprints
    await cleanOldFingerprints(MAX_AGE_MS)

    // Get all fingerprints
    const fingerprints = await getFingerprints(MAX_AGE_MS)
    const storageType = getStorageType()

    // Return the fingerprints
    return NextResponse.json({ fingerprints, storageType }, { headers: corsHeaders })
  } catch (error) {
    console.error("Error retrieving fingerprints:", error)
    return NextResponse.json(
      { error: "Failed to retrieve fingerprints", details: (error as Error).message },
      { status: 500, headers: corsHeaders },
    )
  }
}

