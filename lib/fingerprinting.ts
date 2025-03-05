import { v5 as uuidv5 } from "uuid"
import { emojis, generateMoniker } from "./name-generator"

// UUID namespace for consistent fingerprint generation
const NAMESPACE = "1b671a64-40d5-491e-99b0-da01ff1f3341"

// Canvas fingerprinting
async function getCanvasFingerprint(): Promise<string> {
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  if (!ctx) return "canvas-not-supported"

  // Set canvas dimensions
  canvas.width = 200
  canvas.height = 50

  // Draw background
  ctx.fillStyle = "#f60"
  ctx.fillRect(0, 0, 200, 50)
  ctx.fillStyle = "#069"
  ctx.font = "15px Arial"
  ctx.fillText("Browser Fingerprinting", 2, 15)
  ctx.fillStyle = "rgba(102, 204, 0, 0.7)"
  ctx.font = "18px Times New Roman"
  ctx.fillText("Educational Demo", 4, 40)

  // Draw a complex shape
  ctx.beginPath()
  ctx.arc(50, 25, 10, 0, Math.PI * 2)
  ctx.closePath()
  ctx.fill()

  // Get the canvas data and hash it
  return canvas.toDataURL()
}

// WebGL fingerprinting
function getWebGLInfo() {
  const canvas = document.createElement("canvas")
  let gl
  let debugInfo
  let vendor = "unknown"
  let renderer = "unknown"

  try {
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
    if (gl) {
      debugInfo = gl.getExtension("WEBGL_debug_renderer_info")
      if (debugInfo) {
        vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || "unknown"
        renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "unknown"
      }
    }
  } catch (e) {
    console.error("Error getting WebGL info:", e)
  }

  return { vendor, renderer }
}

// Audio fingerprinting
async function getAudioFingerprint(): Promise<string> {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const analyser = audioContext.createAnalyser()
    const oscillator = audioContext.createOscillator()
    const dynamicsCompressor = audioContext.createDynamicsCompressor()

    // Configure audio nodes
    analyser.fftSize = 1024

    // Connect nodes
    oscillator.connect(dynamicsCompressor)
    dynamicsCompressor.connect(analyser)
    analyser.connect(audioContext.destination)

    // Set properties that might vary between browsers/devices
    oscillator.type = "triangle"
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime)
    dynamicsCompressor.threshold.setValueAtTime(-50, audioContext.currentTime)
    dynamicsCompressor.knee.setValueAtTime(40, audioContext.currentTime)
    dynamicsCompressor.ratio.setValueAtTime(12, audioContext.currentTime)
    dynamicsCompressor.attack.setValueAtTime(0, audioContext.currentTime)
    dynamicsCompressor.release.setValueAtTime(0.25, audioContext.currentTime)

    // Start and stop the oscillator
    oscillator.start(0)
    oscillator.stop(audioContext.currentTime + 0.1)

    // Capture audio data
    return new Promise((resolve) => {
      setTimeout(() => {
        const dataArray = new Uint8Array(analyser.frequencyBinCount)
        analyser.getByteFrequencyData(dataArray)
        const audioData = Array.from(dataArray).join(",")
        audioContext.close()
        resolve(audioData)
      }, 100)
    })
  } catch (e) {
    console.error("Audio fingerprinting error:", e)
    return "audio-not-supported"
  }
}

// Font detection
function detectFonts() {
  const baseFonts = ["monospace", "sans-serif", "serif"]
  const fontList = [
    "Arial",
    "Arial Black",
    "Arial Narrow",
    "Calibri",
    "Cambria",
    "Cambria Math",
    "Comic Sans MS",
    "Courier",
    "Courier New",
    "Georgia",
    "Helvetica",
    "Impact",
    "Lucida Console",
    "Lucida Sans Unicode",
    "Microsoft Sans Serif",
    "Palatino Linotype",
    "Tahoma",
    "Times",
    "Times New Roman",
    "Trebuchet MS",
    "Verdana",
  ]

  const testString = "mmmmmmmmmmlli"
  const testSize = "72px"
  const h = document.getElementsByTagName("body")[0]

  // Create a span in the document to test
  const s = document.createElement("span")
  s.style.fontSize = testSize
  s.innerHTML = testString
  const defaultWidth: Record<string, number> = {}
  const defaultHeight: Record<string, number> = {}

  // Create spans for the base fonts and add them to the document
  for (const baseFont of baseFonts) {
    s.style.fontFamily = baseFont
    h.appendChild(s)
    defaultWidth[baseFont] = s.offsetWidth
    defaultHeight[baseFont] = s.offsetHeight
    h.removeChild(s)
  }

  const detectedFonts: string[] = []
  for (const font of fontList) {
    let isDetected = false
    for (const baseFont of baseFonts) {
      s.style.fontFamily = `'${font}', ${baseFont}`
      h.appendChild(s)
      const match = s.offsetWidth !== defaultWidth[baseFont] || s.offsetHeight !== defaultHeight[baseFont]
      h.removeChild(s)
      if (match) {
        isDetected = true
        break
      }
    }
    if (isDetected) {
      detectedFonts.push(font)
    }
  }

  return detectedFonts
}

// Main fingerprinting function
export async function generateFingerprint() {
  // Collect browser information
  const userAgent = navigator.userAgent
  const language = navigator.language
  const platform = navigator.platform
  const screenWidth = window.screen.width
  const screenHeight = window.screen.height
  const screenDepth = window.screen.colorDepth
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const touchSupport = "ontouchstart" in window
  const cookiesEnabled = navigator.cookieEnabled

  // Get browser and OS info
  let browser = "Unknown"
  let os = "Unknown"

  if (userAgent.indexOf("Firefox") > -1) {
    browser = "Firefox"
  } else if (userAgent.indexOf("SamsungBrowser") > -1) {
    browser = "Samsung Browser"
  } else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
    browser = "Opera"
  } else if (userAgent.indexOf("Edge") > -1 || userAgent.indexOf("Edg/") > -1) {
    browser = "Edge"
  } else if (userAgent.indexOf("Chrome") > -1) {
    browser = "Chrome"
  } else if (userAgent.indexOf("Safari") > -1) {
    browser = "Safari"
  }

  if (userAgent.indexOf("Windows") > -1) {
    os = "Windows"
  } else if (userAgent.indexOf("Mac") > -1) {
    os = "MacOS"
  } else if (userAgent.indexOf("Linux") > -1) {
    os = "Linux"
  } else if (userAgent.indexOf("Android") > -1) {
    os = "Android"
  } else if (userAgent.indexOf("iOS") > -1 || userAgent.indexOf("iPhone") > -1 || userAgent.indexOf("iPad") > -1) {
    os = "iOS"
  }

  // Get advanced fingerprinting data
  const canvasData = await getCanvasFingerprint()
  const webglInfo = getWebGLInfo()
  const audioData = await getAudioFingerprint()
  const fonts = detectFonts()

  // Combine all fingerprinting data
  const fingerprintData = {
    userAgent,
    language,
    platform,
    screenSize: `${screenWidth}x${screenHeight}`,
    colorDepth: `${screenDepth}-bit`,
    timezone,
    touchSupport: String(touchSupport),
    cookiesEnabled: String(cookiesEnabled),
    canvasHash: canvasData,
    webglVendor: webglInfo.vendor,
    webglRenderer: webglInfo.renderer,
    audioHash: audioData,
    fonts: fonts.join(","),
    browser,
    os,
  }

  // Create a string from all the data
  const fingerprintString = JSON.stringify(fingerprintData)

  // Generate a UUID based on the fingerprint string
  const fingerprintId = uuidv5(fingerprintString, NAMESPACE)

  // Generate a stable moniker based on the fingerprint
  const moniker = generateMoniker(fingerprintId)

  // Select a stable emoji based on the fingerprint
  const emojiIndex = Number.parseInt(fingerprintId.substring(0, 8), 16) % emojis.length
  const emoji = emojis[emojiIndex]

  return {
    id: fingerprintId,
    moniker,
    emoji,
    timestamp: Date.now(),
    details: {
      browser,
      os,
      screenSize: `${screenWidth}x${screenHeight}`,
      colorDepth: `${screenDepth}-bit`,
      timezone,
      language,
      canvasHash: canvasData,
      webglVendor: webglInfo.vendor,
      webglRenderer: webglInfo.renderer,
      audioHash: audioData,
    },
  }
}

