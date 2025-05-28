export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a1525] text-white pt-16 flex flex-col items-center justify-center">
      <div className="container mx-auto px-4 py-24 flex flex-col items-center">
        <div className="relative w-16 h-16 mb-8">
          <div className="absolute inset-0 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 border-4 border-blue-400/30 rounded-full"></div>
        </div>
        <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Loading Support Page...
        </h2>
        <p className="text-gray-400 mt-4 text-center">Please wait while we prepare the community support information</p>
      </div>
    </div>
  )
}
