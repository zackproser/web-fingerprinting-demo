export default function LoadingVisualizer() {
  return (
    <div className="w-full h-[60vh] flex flex-col items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-slate-700 border-t-amber-400 rounded-full animate-spin mb-4"></div>
        <span className="absolute top-4 left-4 text-2xl animate-pulse">🔍</span>
      </div>
      <p className="text-slate-300 text-lg">Investigating browser fingerprints...</p>
    </div>
  )
}

