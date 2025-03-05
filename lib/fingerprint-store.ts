// Global variable to store fingerprints across all requests
// This needs to be in the global scope to persist between requests
const GLOBAL_FINGERPRINTS = global as unknown as {
  fingerprints?: Map<string, any>
}

// Initialize the global store if it doesn't exist
if (!GLOBAL_FINGERPRINTS.fingerprints) {
  GLOBAL_FINGERPRINTS.fingerprints = new Map()
  console.log("Initialized global fingerprint store")
}

export function addFingerprint(fingerprint: any): void {
  // Update timestamp
  fingerprint.timestamp = Date.now()

  // Store in global map
  GLOBAL_FINGERPRINTS.fingerprints!.set(fingerprint.id, fingerprint)
  console.log(`Added fingerprint: ${fingerprint.moniker}. Total: ${GLOBAL_FINGERPRINTS.fingerprints!.size}`)
}

export function getFingerprints(): any[] {
  // Convert Map to Array
  const fingerprints = Array.from(GLOBAL_FINGERPRINTS.fingerprints!.values())

  // Sort by timestamp (newest first)
  fingerprints.sort((a, b) => b.timestamp - a.timestamp)

  return fingerprints
}

export function cleanOldFingerprints(maxAgeMs: number): void {
  const now = Date.now()
  let cleaned = 0

  for (const [id, fp] of GLOBAL_FINGERPRINTS.fingerprints!.entries()) {
    if (now - fp.timestamp > maxAgeMs) {
      GLOBAL_FINGERPRINTS.fingerprints!.delete(id)
      cleaned++
    }
  }

  if (cleaned > 0) {
    console.log(`Cleaned ${cleaned} old fingerprints. Remaining: ${GLOBAL_FINGERPRINTS.fingerprints!.size}`)
  }
}

export function getFingerprintCount(): number {
  return GLOBAL_FINGERPRINTS.fingerprints!.size
}

