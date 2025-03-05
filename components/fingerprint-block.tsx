"use client"

import { useEffect, useRef } from "react"
import { motion, useAnimation } from "framer-motion"
import { Globe, Cpu, Monitor, Volume2, PaintBucket } from "lucide-react"
import type { FingerprintData } from "@/lib/db"

type FingerprintBlockProps = {
  data: FingerprintData
  index: number
  isOwn?: boolean
}

// Function to generate a stable color from fingerprint ID
function generateStableColor(id: string, isOwn: boolean): string {
  // If it's the user's own fingerprint, use a special color
  if (isOwn) {
    return "hsl(45, 100%, 35%)" // Gold color for own fingerprint
  }

  // Extract different parts of the ID to use for hue, saturation, and lightness
  const hueBase = id
    .substring(0, 8)
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0)
  const satBase = id
    .substring(8, 16)
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0)
  const lightBase = id
    .substring(16, 24)
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0)

  // Generate HSL values with good ranges for visibility - using more detective-like colors
  // Amber, brown, deep red, dark blue - noir detective palette
  const hues = [30, 45, 15, 210, 0, 20, 200, 25]
  const hueIndex = hueBase % hues.length
  const hue = hues[hueIndex]

  const saturation = 65 + (satBase % 25) // 65-90% saturation for vibrant colors
  const lightness = 25 + (lightBase % 15) // 25-40% lightness for darker, noir-like colors

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

// Function to generate a random but stable x position
function generateStableXPosition(id: string): number {
  // Use multiple parts of the ID to create more randomness
  const part1 = Number.parseInt(id.substring(0, 4), 16)
  const part2 = Number.parseInt(id.substring(4, 8), 16)
  const part3 = Number.parseInt(id.substring(8, 12), 16)

  // Combine the parts with some math operations to increase randomness
  // Use a different formula to ensure better distribution
  const combined = (part1 * 13 + part2 * 17 + part3 * 19) % 1000

  // Return a value between 5 and 85 (to keep cards within view)
  // Use modulo with a smaller range to ensure better distribution
  return 5 + (combined % 75)
}

// Function to generate a random but stable y position
function generateStableYPosition(id: string): number {
  // Use different parts of the ID than the X position to ensure independence
  const part1 = Number.parseInt(id.substring(12, 16), 16)
  const part2 = Number.parseInt(id.substring(16, 20), 16)
  const part3 = Number.parseInt(id.substring(20, 24), 16)

  // Combine the parts with different multipliers
  const combined = (part1 * 7 + part2 * 11 + part3 * 23) % 1000

  // Return a value between 10 and 70 (to keep cards within the visible area)
  return 10 + (combined % 60)
}

export default function FingerprintBlock({ data, index, isOwn = false }: FingerprintBlockProps) {
  const isGpu = data.details.webglRenderer && data.details.webglRenderer !== "unknown"

  // Motion controls
  const controls = useAnimation()
  const containerRef = useRef<HTMLDivElement>(null)

  // Calculate stable positions based on fingerprint ID
  useEffect(() => {
    try {
      const xPos = generateStableXPosition(data.id)
      const yPos = generateStableYPosition(data.id)

      // Start the animation from the calculated position
      controls.start({
        x: `${xPos}%`,
        y: `${yPos}%`,
        opacity: 1,
        transition: { duration: 0.5 },
      })
    } catch (error) {
      console.error("Error positioning fingerprint block:", error)
    }
  }, [data.id, controls])

  // Generate a stable color based on the fingerprint ID
  const bgColor = generateStableColor(data.id, isOwn)

  // Calculate how recent this fingerprint is
  const ageInSeconds = Math.floor((Date.now() - data.timestamp) / 1000)
  const isRecent = ageInSeconds < 10 // Less than 10 seconds old

  return (
    <motion.div
      ref={containerRef}
      className={`absolute w-72 p-4 rounded-lg shadow-lg border cursor-move ${
        isOwn ? "border-amber-500" : isRecent ? "border-green-500" : "border-slate-700"
      }`}
      style={{
        backgroundColor: bgColor,
        zIndex: isOwn ? 1000 : isRecent ? 900 : 100 - index, // Ensure own and recent fingerprints are on top
        top: 0,
        left: 0,
      }}
      initial={{ x: 0, y: 0, opacity: 0 }}
      animate={controls}
      drag
      dragMomentum={false} // Disable momentum for more precise control
      dragElastic={0.1}
      whileDrag={{ scale: 1.05, zIndex: 1000 }}
      whileHover={{ scale: 1.02 }}
      onDragEnd={() => {
        // Reset scale but maintain position
        controls.start({ scale: 1 })
      }}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="text-4xl">{data.emoji}</div>
        <div>
          <h3 className="font-bold text-white text-lg flex items-center">
            {data.moniker}
            {isOwn && <span className="ml-2 text-xs bg-amber-500/50 px-2 py-0.5 rounded-full">You</span>}
            {!isOwn && isRecent && <span className="ml-2 text-xs bg-green-500/50 px-2 py-0.5 rounded-full">New</span>}
          </h3>
          <p className="text-xs text-white/70 flex items-center">
            {new Date(data.timestamp).toLocaleTimeString()}
            <span className="ml-2 text-[10px] text-white/50">({ageInSeconds}s ago)</span>
          </p>
        </div>
      </div>

      {/* Always show basic info */}
      <div className="grid grid-cols-2 gap-2 mt-2 text-white/90 text-sm">
        <div className="flex items-center gap-1">
          <Globe className="w-4 h-4" />
          <span>{data.details.browser}</span>
        </div>
        <div className="flex items-center gap-1">
          <Monitor className="w-4 h-4" />
          <span>{data.details.os}</span>
        </div>
      </div>

      {/* Always expanded detailed info */}
      <div className="mt-3 text-xs bg-black/30 p-3 rounded border border-white/10">
        <div className="grid gap-2">
          <div className="flex items-center gap-2">
            <Monitor className="w-4 h-4 text-white/70" />
            <div>
              <p className="font-semibold text-white/90">Display</p>
              <p className="text-white/70">
                {data.details.screenSize} ({data.details.colorDepth})
              </p>
            </div>
          </div>

          {isGpu && (
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-white/70" />
              <div>
                <p className="font-semibold text-white/90">Graphics</p>
                <p className="text-white/70 break-words">{data.details.webglRenderer}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <PaintBucket className="w-4 h-4 text-white/70" />
            <div>
              <p className="font-semibold text-white/90">Canvas Fingerprint</p>
              <p className="text-white/70">{data.details.canvasHash.substring(0, 16)}...</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-white/70" />
            <div>
              <p className="font-semibold text-white/90">Audio Fingerprint</p>
              <p className="text-white/70">{data.details.audioHash.substring(0, 16)}...</p>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-white/20">
            <p className="text-white/50 text-[10px]">Fingerprint ID: {data.id.substring(0, 16)}...</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

