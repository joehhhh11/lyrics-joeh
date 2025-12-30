import React from "react";
import { motion } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";

const PlayerControls = ({
  currentSong,
  isPlaying,
  currentTime,
  duration,
  onTogglePlay,
  onSkipBack,
  onSkipForward,
  onProgressClick,
}) => {
  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      className="w-full max-w-2xl bg-black/40 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/10"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-white">{currentSong.title}</h2>
        <p className="text-gray-400 text-sm">{currentSong.artist}</p>
      </div>

      <div className="mb-4">
        <div
          className="relative h-1 bg-gray-700 rounded-full overflow-hidden cursor-pointer"
          onClick={onProgressClick}
        >
          <motion.div
            className="absolute h-full bg-gradient-to-r from-purple-500 to-pink-500"
            style={{
              width: `${duration ? (currentTime / duration) * 100 : 0}%`,
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSkipBack}
          className="text-white/70 hover:text-white transition"
        >
          <SkipBack size={24} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onTogglePlay}
          className="bg-white text-black rounded-full p-3 hover:bg-gray-200 transition"
        >
          {isPlaying ? (
            <Pause size={28} color="black" />
          ) : (
            <Play size={28} className="ml-1" />
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSkipForward}
          className="text-white/70 hover:text-white transition"
        >
          <SkipForward size={24} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PlayerControls;