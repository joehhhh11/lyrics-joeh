import React from "react";
import { motion } from "framer-motion";
export default function TypewriterLine({ text, isActive }) {
  const chars = text.split("");

  return (
    <motion.div className="text-5xl md:text-5xl font-grand text-center mx-auto px-4 text-sipro">
      {chars.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: isActive ? 0.08 : 0,
            delay: isActive ? i * 0.04 : 0,
            ease: "easeOut",
          }}
          className="text-sipro text-[5.5rem]"
        >
          {char}
        </motion.span>
      ))}
    </motion.div>
  );
};
