"use client"

import { motion } from "framer-motion"

interface LinkButtonProps {
  href: string
  text: string
}

export default function LinkButton({ href, text }: LinkButtonProps) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full px-4 py-3 text-center rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 border border-blue-500/20 hover:border-blue-500/40 text-gray-200 hover:text-white transition-all duration-300 backdrop-blur-sm"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {text}
    </motion.a>
  )
}
