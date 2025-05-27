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
            <p>
              Heroes of Diamond Legacy ($HODL) was born from a passion for the Algorand ecosystem and the belief in the
              power of community. The project emerged in December 2024 from a deep connection with Algorand and the
              vision to build something that transcends trends.
            </p>

            <p>
              The first purpose of $HODL is to attest the true Diamond Hands within the ecosystem. By rewarding
              resilience and loyalty, $HODL certifies the holders who stay strong through volatility and uncertainty.
              These Heroes, recognized by their unwavering commitment, carry weight wherever they go. When they engage
              with other projects, they bring with them a seal of strength that only true Diamond Hands can offer.
            </p>

            <p>
              The journey also expands into empowering artists and innovators around the world, building a platform
              where creativity and talent are celebrated without barriers. The foundation of $HODL is built on the core
              values of Algorand technology, like efficiency, transparency, scalability, and freedom of creation.
            </p>

            <p>
              $HODL is more than a memecoin. It is a culture. It is about those who trust intuition when logic alone is
              not enough. Heroes who, by holding with conviction, create natural scarcity and strengthen everything they
              touch.
            </p>

            <p>
              Heroes of Diamond Legacy is a living story made of art, symbols, and people. A project that builds meaning
              through creativity, presence, and a collective spirit. HODL is not about riding waves. It is about
              building a legacy.
            </p>

            <p className="text-center text-2xl mt-12">Keep HODLing. The real journey has just begun.</p>
            <p className="text-center text-2xl mt-2">👐💎</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
