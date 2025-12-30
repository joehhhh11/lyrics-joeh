import React from "react";
import { motion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const BackgroundAnimations = () => {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed bottom-0 left-0 transform -translate-x-1/2 text-center z-1"
    >
      <div className="flex flex-row justify-between w-screen items-center h-[80vh]">
        <DotLottieReact
          src="https://lottie.host/9c2a1b0c-8856-4c3c-9c34-c28ca9e7abeb/R4HLMqBLL7.lottie"
          loop
          autoplay
          className="w-[100vw] h-[80vh] object-contain -ml-96 z-1"
        />

        <DotLottieReact
          src="https://lottie.host/9c2a1b0c-8856-4c3c-9c34-c28ca9e7abeb/R4HLMqBLL7.lottie"
          loop
          autoplay
          className="w-[100vw] h-[80vh] object-contain -mr-96 z-1"
        />
      </div>
    </motion.div>
  );
};

export default BackgroundAnimations;