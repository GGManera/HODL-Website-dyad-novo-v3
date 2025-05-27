interface LinkButtonProps {
  href: string
  text: string
}

export function LinkButton({ href, text }: LinkButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors duration-200 w-full h-full"
    >
      {text}
    </a>
  )
}
