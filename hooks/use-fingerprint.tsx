"use client"

import { useState, useEffect } from "react"
import { generateFingerprint } from "@/lib/fingerprinting"

export function useFingerprint() {
  const [fingerprint, setFingerprint] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getFingerprint() {
      try {
        const fp = await generateFingerprint()
        setFingerprint(fp)
      } catch (error) {
        console.error("Error generating fingerprint:", error)
      } finally {
        setLoading(false)
      }
    }

    getFingerprint()
  }, [])

  return { fingerprint, loading }
}

