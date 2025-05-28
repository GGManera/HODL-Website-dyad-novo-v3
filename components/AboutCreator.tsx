"use client"

import { motion } from "framer-motion"

export default function AboutCreator() {
  return (
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto py-0"
      >
        <div className="bg-gradient-to-b from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 md:p-10 border border-blue-500/10">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-8 gradient-heading font-sans">
            <span className="gradient-text-fix">The HODL Culture</span>
          </h3>
          <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
            <p className="text-justify">
              Heroes Of Diamond Legacy ($HODL) was born from a deep passion for the Algorand ecosystem and a belief in the transformative power of a community united by values beyond mere investment. Founded in December 2024, the project is rooted in Algorand but grows with a vision to build something that transcends trends and technological boundaries.
            </p>

            <p className="text-justify">
              The original purpose of $HODL is to recognize the true Diamond Hands of the ecosystem — those who stand firm and resilient through market volatility and uncertainty. These Heroes, valued for their unwavering commitment, carry a seal of strength that echoes through every project they engage with, establishing a reputation built on time and conviction.
            </p>

            <p className="text-justify">
              But $HODL is much more than that. It is a living, dynamic culture that fosters artistic and technological innovation, celebrating global talents through a collaborative curatorial process. Each month, artists from diverse backgrounds reinterpret the four core NFTs — Emerald, Ruby, Sapphire, and Diamond — adding new styles, perspectives, and chapters to a narrative that grows and evolves with the community.
            </p>

            <p className="text-justify">
              Built on the values of efficiency, transparency, scalability, and creative freedom that Algorand provides, $HODL is creating a multichain ecosystem that honors its pioneers while welcoming new communities aligned with a vision that goes beyond maximalism.
            </p>

            <p className="text-justify">
              $HODL was never just a meme. It’s a space for those who trust intuition when logic alone isn’t enough. Those who hold with conviction create natural scarcity and strengthen everything they touch.
            </p>
            
            <p className="text-justify">
              Heroes Of Diamond Legacy is a story in the making, shaped by art, symbols, and real people. It’s a project that builds meaning through creativity, presence, and collective spirit. This isn’t about riding waves. It’s about sailing through them — and building a legacy that lasts.
            </p>

            <p className="text-center text-2xl mt-12">Keep HODLing. The real journey has just begun.</p>
            <p className="text-center text-2xl mt-2">👐💎</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}