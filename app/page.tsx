import { Suspense } from "react"
import FingerprintVisualizer from "@/components/fingerprint-visualizer"
import LoadingVisualizer from "@/components/loading-visualizer"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-[#E3C396] text-[#2C1810] relative overflow-hidden">
      {/* Folder ridge effect */}
      <div className="absolute inset-x-0 top-0 h-24 folder-ridge"></div>
      
      {/* Paper texture */}
      <div className="absolute inset-0 paper-texture opacity-50"></div>

      {/* Topographical map patterns */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Original brown lines */}
        <div
          className="absolute inset-0 opacity-15 bg-repeat"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' stroke='%23432818' stroke-width='1.5' d='M20,20 Q50,10 80,20 T140,20 T180,20 M20,50 Q50,40 80,50 T140,50 T180,50 M20,80 Q50,70 80,80 T140,80 T180,80 M20,110 Q50,100 80,110 T140,110 T180,110 M20,140 Q50,130 80,140 T140,140 T180,140 M20,170 Q50,160 80,170 T140,170 T180,170'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        ></div>
        
        {/* Green contour lines - top section */}
        <div
          className="absolute top-0 left-0 right-0 h-[60%] opacity-20 bg-repeat-x"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='400' height='100' viewBox='0 0 400 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' stroke='%23255C41' stroke-width='2' d='M0,20 C100,10 200,40 300,20 S350,25 400,15 M0,50 C150,30 250,70 350,40 S375,45 400,35 M0,80 C50,60 150,90 250,70 S300,75 400,65'/%3E%3C/svg%3E")`,
            backgroundSize: '400px 100px',
            transform: 'rotate(-1deg)',
          }}
        ></div>

        {/* Blue water features - larger area */}
        <div
          className="absolute top-[5%] right-[2%] w-[45%] h-[30%] opacity-20 bg-repeat"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' stroke='%23234B6E' stroke-width='2' d='M10,10 Q30,30 50,10 T90,10 T120,10 M10,40 Q30,60 50,40 T90,40 T120,40 M10,70 Q30,90 50,70 T90,70 T120,70 M10,100 Q30,120 50,100 T90,100 T120,100'/%3E%3C/svg%3E")`,
            backgroundSize: '120px 120px',
            transform: 'rotate(12deg)',
          }}
        ></div>

        {/* Additional terrain features - dark green spots */}
        <div
          className="absolute top-[15%] left-[10%] w-[35%] h-[25%] opacity-15 bg-repeat"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='30' cy='30' r='3' fill='%23143D2A' /%3E%3Ccircle cx='10' cy='10' r='2' fill='%23143D2A' /%3E%3Ccircle cx='50' cy='50' r='2' fill='%23143D2A' /%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}
        ></div>

        {/* Red grid lines */}
        <div
          className="absolute top-[5%] left-[5%] w-[90%] h-[40%] opacity-10 bg-repeat"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='%23AA0000' stroke-width='0.5' d='M0,0 L100,0 M0,25 L100,25 M0,50 L100,50 M0,75 L100,75 M0,100 L100,100 M0,0 L0,100 M25,0 L25,100 M50,0 L50,100 M75,0 L75,100 M100,0 L100,100' /%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px',
          }}
        ></div>
      </div>

      {/* Mission planning elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[30%] left-[15%] -rotate-[15deg] opacity-20">
          <div className="w-32 h-32 border-2 border-[#2C1810] rounded-full"></div>
          <div className="absolute inset-0 border-2 border-[#2C1810] rounded-full transform rotate-45"></div>
        </div>
        <div className="absolute bottom-[25%] right-[20%] rotate-[30deg] opacity-20">
          <div className="w-48 h-24 border-2 border-[#2C1810]">
            <div className="absolute inset-2 border border-[#2C1810] border-dashed"></div>
          </div>
        </div>
      </div>

      {/* Enhanced TOP SECRET stamp */}
      <div className="absolute top-4 right-[5%] -rotate-12 z-20">
        <div className="stamp-effect">
          <div className="border-8 border-[#FF0000] rounded-lg p-6 bg-white/10 backdrop-blur-sm ink-drip">
            <div className="text-[#FF0000] text-5xl font-bold tracking-widest" style={{ fontFamily: 'Impact, sans-serif' }}>
              TOP SECRET
            </div>
          </div>
        </div>
      </div>

      {/* Folder tabs - enhanced */}
      <div className="absolute top-0 right-10 w-32 h-12 bg-[#D4B38C] rounded-b-lg transform -translate-y-2 opacity-90 shadow-md"></div>
      <div className="absolute top-0 left-20 w-40 h-14 bg-[#D4B38C] rounded-b-lg transform -translate-y-3 opacity-90 shadow-md"></div>

      {/* Remove old fingerprint background */}
      {/* Magnifying glass decoration - updated color */}
      <div className="absolute top-20 right-10 opacity-30 pointer-events-none hidden md:block">
        <svg width="150" height="150" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
            stroke="#2C1810"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M21 21L16.65 16.65" stroke="#2C1810" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Detective hat decoration - updated color */}
      <div className="absolute top-40 left-10 opacity-30 pointer-events-none hidden md:block">
        <svg width="150" height="150" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M2 19H22M2 19C2 19 3 15 12 15C21 15 22 19 22 19M2 19L2.5 17M22 19L21.5 17M12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12C15 13.6569 13.6569 15 12 15M15 14H17C18.1046 14 19 13.1046 19 12V7C19 5.89543 18.1046 5 17 5H14C12.8954 5 12 5.89543 12 7V9"
            stroke="#2C1810"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <header className="w-full py-8 px-4 text-center border-b border-[#B39B80] bg-[#D4B38C]/90 backdrop-blur-sm relative z-10">
        <div className="max-w-6xl mx-auto relative">
          {/* WorkOS attribution in header */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 text-xs">
            <span>Built by</span>
            <a 
              href="https://workos.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center hover:opacity-75 transition-opacity"
            >
              <img src="/workos-logo.svg" alt="WorkOS" className="h-4 w-auto" />
            </a>
          </div>

          <div className="flex items-center justify-center mb-3">
            <span className="text-4xl mr-3">🔍</span>
            <h1 className="text-4xl md:text-5xl font-bold text-[#2C1810] relative">
              Digital Detective
            </h1>
          </div>
          <p className="text-lg text-[#4A3828] max-w-2xl mx-auto">
            Unmasking browser identities through digital fingerprinting
          </p>
          <div className="mt-4 text-sm text-[#4A3828] max-w-xl mx-auto p-4 bg-[#C4A37C]/50 rounded-lg border-2 border-[#B39B80] shadow-inner">
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
          <div className="info-panel rounded-lg p-6">
            <FingerprintVisualizer />
          </div>
        </Suspense>
      </section>

      <footer className="w-full py-4 px-4 text-center border-t border-[#B39B80] text-sm text-[#4A3828] relative z-10 bg-[#D4B38C]/30">
        <p className="mb-2">Educational demonstration of browser fingerprinting techniques</p>
        <div className="flex items-center justify-center gap-2 text-xs">
          <span>Built with</span>
          <span className="text-red-600">❤️</span>
          <span>by</span>
          <a 
            href="https://workos.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center hover:opacity-75 transition-opacity"
          >
            <img src="/workos-logo.svg" alt="WorkOS" className="h-4 w-auto" />
          </a>
        </div>
      </footer>
    </main>
  )
}

