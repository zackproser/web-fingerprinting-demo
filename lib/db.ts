import { prisma } from "./prisma"

// Define the fingerprint type
export type FingerprintData = {
  id: string
  moniker: string
  emoji: string
  timestamp: number
  details: {
    browser: string
    os: string
    screenSize: string
    colorDepth: string
    timezone: string
    language: string
    canvasHash: string
    webglVendor: string
    webglRenderer: string
    audioHash: string
  }
}

// Create a fallback in-memory store
const inMemoryStore = new Map<string, FingerprintData>()
let useInMemoryFallback = false
let dbInitialized = false

// Initialize the database
export async function initDatabase() {
  if (dbInitialized) return true

  try {
    // Check if we can connect to the database
    await prisma.$connect()

    console.log("Database connected successfully")
    dbInitialized = true
    return true
  } catch (error) {
    console.error("Error connecting to database:", error)
    useInMemoryFallback = true
    console.log("Falling back to in-memory store")
    return true // Return true to allow the app to continue with the fallback
  }
}

// Add a fingerprint to the database or in-memory store
export async function addFingerprint(fingerprint: FingerprintData) {
  try {
    // Update timestamp
    fingerprint.timestamp = Date.now()

    if (useInMemoryFallback) {
      // Store in memory
      inMemoryStore.set(fingerprint.id, fingerprint)
      console.log(`Fingerprint registered in memory: ${fingerprint.moniker}`)
      return true
    }

    // Insert or update the fingerprint using Prisma
    await prisma.fingerprint.upsert({
      where: { id: fingerprint.id },
      update: {
        timestamp: BigInt(fingerprint.timestamp),
        details: fingerprint.details as any,
        updatedAt: new Date(),
      },
      create: {
        id: fingerprint.id,
        moniker: fingerprint.moniker,
        emoji: fingerprint.emoji,
        timestamp: BigInt(fingerprint.timestamp),
        details: fingerprint.details as any,
      },
    })

    console.log(`Fingerprint registered in database: ${fingerprint.moniker}`)
    return true
  } catch (error) {
    console.error("Error adding fingerprint:", error)

    // Fallback to in-memory store
    inMemoryStore.set(fingerprint.id, fingerprint)
    console.log(`Fingerprint registered in memory (fallback): ${fingerprint.moniker}`)
    useInMemoryFallback = true
    return true
  }
}

// Get all fingerprints from the database or in-memory store
export async function getFingerprints(maxAgeMs = 120000) {
  try {
    if (useInMemoryFallback) {
      // Get from memory
      const cutoffTimestamp = Date.now() - maxAgeMs
      const fingerprints = Array.from(inMemoryStore.values())
        .filter((fp) => fp.timestamp > cutoffTimestamp)
        .sort((a, b) => b.timestamp - a.timestamp)

      console.log(`Retrieved ${fingerprints.length} fingerprints from memory`)
      return fingerprints
    }

    // Calculate the cutoff timestamp
    const cutoffTimestamp = Date.now() - maxAgeMs

    // Get all fingerprints newer than the cutoff using Prisma
    const fingerprints = await prisma.fingerprint.findMany({
      where: {
        timestamp: {
          gt: BigInt(cutoffTimestamp),
        },
      },
      orderBy: {
        timestamp: "desc",
      },
    })

    // Convert the Prisma records to FingerprintData objects
    const result: FingerprintData[] = fingerprints.map((fp) => ({
      id: fp.id,
      moniker: fp.moniker,
      emoji: fp.emoji,
      timestamp: Number(fp.timestamp),
      details: fp.details as FingerprintData["details"],
    }))

    console.log(`Retrieved ${result.length} fingerprints from database`)
    return result
  } catch (error) {
    console.error("Error getting fingerprints:", error)

    // Fallback to in-memory store
    const cutoffTimestamp = Date.now() - maxAgeMs
    const fingerprints = Array.from(inMemoryStore.values())
      .filter((fp) => fp.timestamp > cutoffTimestamp)
      .sort((a, b) => b.timestamp - a.timestamp)

    console.log(`Retrieved ${fingerprints.length} fingerprints from memory (fallback)`)
    useInMemoryFallback = true
    return fingerprints
  }
}

// Clean up old fingerprints
export async function cleanOldFingerprints(maxAgeMs = 120000) {
  try {
    const cutoffTimestamp = Date.now() - maxAgeMs

    if (useInMemoryFallback) {
      // Clean from memory
      let cleaned = 0
      for (const [id, fp] of inMemoryStore.entries()) {
        if (fp.timestamp < cutoffTimestamp) {
          inMemoryStore.delete(id)
          cleaned++
        }
      }

      if (cleaned > 0) {
        console.log(`Cleaned ${cleaned} old fingerprints from memory. Remaining: ${inMemoryStore.size}`)
      }
      return true
    }

    // Delete all fingerprints older than the cutoff using Prisma
    const result = await prisma.fingerprint.deleteMany({
      where: {
        timestamp: {
          lt: BigInt(cutoffTimestamp),
        },
      },
    })

    if (result.count > 0) {
      console.log(`Cleaned ${result.count} old fingerprints from database`)
    }
    return true
  } catch (error) {
    console.error("Error cleaning old fingerprints:", error)

    // Clean from in-memory store as fallback
    const cutoffTimestamp = Date.now() - maxAgeMs
    let cleaned = 0
    for (const [id, fp] of inMemoryStore.entries()) {
      if (fp.timestamp < cutoffTimestamp) {
        inMemoryStore.delete(id)
        cleaned++
      }
    }

    if (cleaned > 0) {
      console.log(`Cleaned ${cleaned} old fingerprints from memory (fallback). Remaining: ${inMemoryStore.size}`)
    }
    useInMemoryFallback = true
    return true
  }
}

// Get the count of fingerprints
export async function getFingerprintCount() {
  try {
    if (useInMemoryFallback) {
      return inMemoryStore.size
    }

    // Get the count using Prisma
    const count = await prisma.fingerprint.count()
    return count
  } catch (error) {
    console.error("Error getting fingerprint count:", error)
    useInMemoryFallback = true
    return inMemoryStore.size
  }
}

// Get the storage type (database or memory)
export function getStorageType() {
  return useInMemoryFallback ? "memory" : "database"
}

