"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useFingerprint } from "@/hooks/use-fingerprint"
import FingerprintBlock from "@/components/fingerprint-block"
import type { FingerprintData } from "@/lib/db"

export default function FingerprintVisualizer() {
  const [fingerprints, setFingerprints] = useState<FingerprintData[]>([])
  const { fingerprint, loading } = useFingerprint()
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [showDebug, setShowDebug] = useState(false)
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null)
  const [isRegistering, setIsRegistering] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [storageType, setStorageType] = useState<string>("initializing")

  // Function to fetch fingerprints
  const fetchFingerprints = useCallback(async () => {
    if (!fingerprint || isFetching) return

    setIsFetching(true)
    try {
      const response = await fetch("/api/fingerprints")
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorData.details || "Unknown error"}`)
      }

      const data = await response.json()
      // console.log(`Fetched ${data.fingerprints?.length || 0} fingerprints from ${data.storageType}`)
      setStorageType(data.storageType || "unknown")

      // Always ensure our own fingerprint is in the list
      const updatedData = [...(data.fingerprints || [])]
      const ownFingerprintIndex = updatedData.findIndex((fp) => fp.id === fingerprint.id)

      if (ownFingerprintIndex === -1) {
        // Our fingerprint is not in the list, add it
        // console.log("Adding own fingerprint to list")
        updatedData.push({
          ...fingerprint,
          timestamp: Date.now(), // Ensure timestamp is current
        })
      }

      setFingerprints(updatedData)
      setLastFetchTime(new Date())
      setError(null)
    } catch (error) {
      console.error("Error fetching fingerprints:", error)
      setError(`Connection error: Using in-memory storage. Your fingerprints will be visible but may not persist across all clients.`)
      // Don't clear fingerprints on error to maintain the last known state
    } finally {
      setIsFetching(false)
    }
  }, [fingerprint, isFetching])

  // Function to fetch debug info
  const fetchDebugInfo = useCallback(async () => {
    if (!showDebug) return

    try {
      const response = await fetch("/api/debug")
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorData.details || "Unknown error"}`)
      }

      const data = await response.json()
      setDebugInfo(data)
    } catch (error) {
      console.error("Error fetching debug info:", error)
    }
  }, [showDebug])

  // Register our fingerprint when it's available
  useEffect(() => {
    if (loading || !fingerprint || isRegistering) return

    async function registerFingerprint() {
      setIsRegistering(true)
      try {
        // console.log("Registering fingerprint:", fingerprint.moniker)

        const response = await fetch("/api/fingerprints", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...fingerprint,
            timestamp: Date.now(), // Ensure timestamp is current
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(`HTTP error! status: ${response.status}, details: ${errorData.details || "Unknown error"}`)
        }

        const data = await response.json()
        // console.log(`Registered fingerprint: ${fingerprint.moniker}. Total: ${data.count} (${data.storageType})`)
        setStorageType(data.storageType || "unknown")
      } catch (error) {
        console.error("Error registering fingerprint:", error)
        setError(`Failed to register fingerprint: ${(error as Error).message}`)
      } finally {
        setIsRegistering(false)
      }
    }

    // Register immediately
    registerFingerprint()

    // Register fingerprint every 2 minutes to keep it active
    const interval = setInterval(registerFingerprint, 120000)

    return () => clearInterval(interval)
  }, [fingerprint, loading])

  // Fetch all fingerprints periodically
  useEffect(() => {
    if (!fingerprint) return

    // Debounce the initial fetch
    const initialFetchTimeout = setTimeout(fetchFingerprints, 1000)

    // Then fetch every 30 seconds
    const interval = setInterval(fetchFingerprints, 30000)

    return () => {
      clearTimeout(initialFetchTimeout)
      clearInterval(interval)
    }
  }, [fingerprint, fetchFingerprints])

  // Fetch debug info periodically
  useEffect(() => {
    if (showDebug) {
      fetchDebugInfo()
      const interval = setInterval(fetchDebugInfo, 30000)
      return () => clearInterval(interval)
    }
  }, [showDebug, fetchDebugInfo])

  if (loading) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-slate-700 border-t-amber-400 rounded-full animate-spin mb-4"></div>
            <span className="absolute top-4 left-4 text-2xl animate-pulse">🔍</span>
          </div>
          <p className="text-slate-300 text-lg">Investigating browser fingerprints...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="mb-8 p-6 bg-slate-800/80 backdrop-blur-sm rounded-lg border border-slate-700 shadow-xl">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <span className="text-2xl mr-2">👤</span>
          Your Browser Fingerprint
        </h2>
        {fingerprint && (
          <div className="flex flex-col md:flex-row items-start gap-4">
            <div className="flex flex-col items-center">
              <div className="bg-[#1A1A1A] p-4 rounded-lg shadow-inner border border-[#333333]">
                <div className="text-6xl filter grayscale bg-gradient-to-b from-slate-800 to-slate-900 p-4 rounded border border-[#444444]" style={{ fontFamily: 'serif' }}>
                  {fingerprint.emoji}
                </div>
                <div className="mt-2 bg-white rounded border border-[#666666] shadow-inner">
                  <div className="border-b border-[#DDD] px-2 pt-1 pb-0.5">
                    <p className="font-mono text-[10px] text-slate-400 uppercase">Subject ID</p>
                  </div>
                  <p className="px-2 py-1.5 font-bold text-black" style={{ fontFamily: 'Permanent Marker, cursive' }}>
                    #{fingerprint.id.substring(0, 8)}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
              <p className="text-2xl font-semibold">{fingerprint.moniker}</p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                <div>
                  <p className="text-slate-400 text-sm mb-1">System Info</p>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="text-slate-400">Browser:</span> {fingerprint.details.browser}
                    </p>
                    <p className="text-sm">
                      <span className="text-slate-400">OS:</span> {fingerprint.details.os}
                    </p>
                    <p className="text-sm">
                      <span className="text-slate-400">Language:</span> {fingerprint.details.language}
                    </p>
                    <p className="text-sm">
                      <span className="text-slate-400">Timezone:</span> {fingerprint.details.timezone}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Display Info</p>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="text-slate-400">Screen:</span> {fingerprint.details.screenSize}
                    </p>
                    <p className="text-sm">
                      <span className="text-slate-400">Color Depth:</span> {fingerprint.details.colorDepth}
                    </p>
                    <p className="text-sm">
                      <span className="text-slate-400">GPU Vendor:</span> {fingerprint.details.webglVendor}
                    </p>
                    <p className="text-sm">
                      <span className="text-slate-400">GPU Renderer:</span> {fingerprint.details.webglRenderer}
                    </p>
                  </div>
                </div>
                <div className="md:col-span-2 lg:col-span-1">
                  <p className="text-slate-400 text-sm mb-1">Fingerprint Hashes</p>
                  <div className="space-y-2">
                    <p className="text-sm break-all">
                      <span className="text-slate-400">Canvas:</span> {fingerprint.details.canvasHash.substring(0, 32)}...
                    </p>
                    <p className="text-sm break-all">
                      <span className="text-slate-400">Audio:</span> {fingerprint.details.audioHash.substring(0, 32)}...
                    </p>
                    <p className="text-sm break-all">
                      <span className="text-slate-400">ID:</span> {fingerprint.id}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-4">Last Updated: {new Date(fingerprint.timestamp).toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center">
          <span className="text-2xl mr-2">🔎</span>
          Connected Browsers ({fingerprints.length})
        </h2>

        <div className="flex gap-2">
          <div className="text-xs text-slate-400 self-center">
            {lastFetchTime && `Last updated: ${lastFetchTime.toLocaleTimeString()}`}
            {storageType && ` (${storageType})`}
            {isFetching && <span className="ml-2 text-amber-400 animate-pulse">Updating...</span>}
          </div>

          <button
            onClick={() => setShowDebug(!showDebug)}
            className="px-3 py-1 bg-slate-700/50 hover:bg-slate-700/80 rounded-md text-sm flex items-center"
          >
            <span className="mr-1">🐞</span> {showDebug ? "Hide" : "Show"} Debug
          </button>

          <button
            onClick={fetchFingerprints}
            disabled={isFetching}
            className="px-3 py-1 bg-amber-600/30 hover:bg-amber-600/50 disabled:opacity-50 rounded-md text-sm flex items-center"
          >
            <span className="mr-1">{isFetching ? "⏳" : "🔄"}</span> Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-md text-white">
          <p className="flex items-center">
            <span className="text-xl mr-2">⚠️</span>
            {error}
          </p>
          <div className="mt-2 text-sm">
            <p>
              Using in-memory storage as fallback. Your fingerprints will still be visible but may not persist across
              all clients.
            </p>
          </div>
        </div>
      )}

      {showDebug && debugInfo && (
        <div className="mb-4 p-3 bg-slate-800/80 border border-slate-600 rounded-md text-white">
          <h3 className="font-bold mb-2">Debug Info</h3>
          <p>Storage type: {debugInfo.storageType}</p>
          <p>Server fingerprint count: {debugInfo.count}</p>
          <div className="mt-2 text-xs">
            <h4 className="font-semibold mb-1">Server Fingerprints:</h4>
            <ul className="grid gap-1">
              {debugInfo.fingerprints.map((fp: any) => (
                <li key={fp.id} className="flex items-center gap-2">
                  <span className="bg-slate-700 px-1 rounded">{fp.id}</span>
                  <span>{fp.moniker}</span>
                  <span className="text-slate-400">
                    ({fp.browser}, {fp.os})
                  </span>
                  <span className="text-slate-500">{new Date(fp.timestamp).toLocaleTimeString()}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div
        ref={containerRef}
        className="relative w-full h-[60vh] overflow-hidden bg-slate-900/80 backdrop-blur-sm rounded-lg border border-slate-700 shadow-xl"
      >
        <div className="absolute inset-0 p-4">
          {fingerprints.map((fp, index) => (
            <FingerprintBlock
              key={fp.id}
              data={fp}
              index={index}
              isOwn={fingerprint ? fp.id === fingerprint.id : false}
            />
          ))}
        </div>

        {fingerprints.length === 0 && !error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-4 bg-slate-800/50 rounded-lg">
              <p className="text-lg text-slate-300">No fingerprints detected yet</p>
              <p className="text-sm text-slate-400 mt-2">Waiting for connections...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

