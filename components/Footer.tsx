export default function Footer() {
  return (
    <footer className="py-8 mt-auto">
      <div className="container mx-auto px-4 flex items-center justify-end gap-2">
        <span className="text-gray-400 text-sm">Data provided by</span>
        <a
          href="https://perawallet.app"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pera-logomark-white-sjEQZcQSWIvy2R7fKsrxOslL2QYwkC.png"
            alt="Pera Wallet"
            className="h-6 w-auto"
          />
          <span className="text-white">Pera</span>
        </a>
      </div>
    </footer>
  )
}
