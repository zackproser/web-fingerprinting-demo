import { Suspense } from "react"
import FingerprintVisualizer from "@/components/fingerprint-visualizer"
import LoadingVisualizer from "@/components/loading-visualizer"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-[#121620] text-white relative">
      {/* Fingerprint pattern background */}
      <div
        className="absolute inset-0 z-0 opacity-10 pointer-events-none bg-repeat"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30,10 C40,10 50,20 50,30 C50,40 40,50 30,50 C20,50 10,40 10,30 C10,20 20,10 30,10 Z M70,10 C80,10 90,20 90,30 C90,40 80,50 70,50 C60,50 50,40 50,30 C50,20 60,10 70,10 Z M30,50 C40,50 50,60 50,70 C50,80 40,90 30,90 C20,90 10,80 10,70 C10,60 20,50 30,50 Z M70,50 C80,50 90,60 90,70 C90,80 80,90 70,90 C60,90 50,80 50,70 C50,60 60,50 70,50 Z' fill='%23ffffff' fillOpacity='0.4'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      ></div>

      {/* Magnifying glass decoration */}
      <div className="absolute top-20 right-10 opacity-20 pointer-events-none hidden md:block">
        <svg width="150" height="150" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M21 21L16.65 16.65" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Detective hat decoration */}
      <div className="absolute top-40 left-10 opacity-20 pointer-events-none hidden md:block">
        <svg width="150" height="150" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M2 19H22M2 19C2 19 3 15 12 15C21 15 22 19 22 19M2 19L2.5 17M22 19L21.5 17M12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12C15 13.6569 13.6569 15 12 15ZM12 9V7C12 5.89543 11.1046 5 10 5H7C5.89543 5 5 5.89543 5 7V12C5 13.1046 5.89543 14 7 14H8M12 9C13.6569 9 15 10.3431 15 12C15 13.6569 13.6569 15 12 15M15 14H17C18.1046 14 19 13.1046 19 12V7C19 5.89543 18.1046 5 17 5H14C12.8954 5 12 5.89543 12 7V9"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <header className="w-full py-8 px-4 text-center border-b border-gray-800 bg-[#1a1f2e]/80 backdrop-blur-sm relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center mb-3">
            <span className="text-4xl mr-3">🔍</span>
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-red-500">
              Digital Detective
            </h1>
          </div>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Unmasking browser identities through digital fingerprinting
          </p>
          <div className="mt-4 text-sm text-slate-400 max-w-xl mx-auto p-3 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="flex items-center mb-2">
              <span className="text-xl mr-2">📋</span>
              <span className="font-semibold">Case File:</span>
            </div>
            <p>
              This investigation collects browser information like canvas rendering, WebGL capabilities, audio
              processing, and more to create a unique identifier for each browser.
            </p>
          </div>
        </div>
      </header>

      <section className="w-full max-w-6xl mx-auto p-6 flex-1 relative z-10">
        <Suspense fallback={<LoadingVisualizer />}>
          <FingerprintVisualizer />
        </Suspense>
      </section>

      <footer className="w-full py-4 px-4 text-center border-t border-gray-800 text-sm text-slate-400 relative z-10">
        <p>Educational demonstration of browser fingerprinting techniques</p>
      </footer>
    </main>
  )
}

