import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Menu,
  X,
  Music,
  Backpack,
} from "lucide-react";
import { songs } from "./songs";
import TypewriterLine from "./TypewriterLine";
import BackgroundAnimations from "./BackgroundAnimations";
import SpotifyMinimal from "./Spotify";
export default function Lyrics() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(-1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [showSpotify, setShowSpotify] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const updateDuration = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentSong]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    let newIndex = -1;
    for (let i = currentSong.lyrics.length - 1; i >= 0; i--) {
      if (currentTime >= currentSong.lyrics[i].time) {
        newIndex = i;
        break;
      }
    }
    setCurrentLyricIndex(newIndex);
  }, [currentTime, currentSong.lyrics]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSkipBack = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, currentTime - 5);
    }
  };

  const handleSkipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(duration, currentTime + 5);
    }
  };

  const handleProgressClick = (e) => {
    if (!audioRef.current || !duration) return;

    const bounds = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - bounds.left) / bounds.width;
    audioRef.current.currentTime = percent * duration;
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getPreviousLyrics = () => {
    if (currentLyricIndex < 1) return [];
    return [currentSong.lyrics[currentLyricIndex - 1]];
  };

const selectSong = (song) => {
  if (song.id === 4) {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setShowSpotify(true);
  } else {
    setShowSpotify(false);
    setCurrentSong(song);
    setIsPlaying(false);
    setCurrentTime(0);
    setSidebarOpen(false);
  }
};
  const currentLyric =
    currentLyricIndex >= 0 ? currentSong.lyrics[currentLyricIndex] : null;
  const nextLyric =
    currentLyricIndex + 1 < currentSong.lyrics.length
      ? currentSong.lyrics[currentLyricIndex + 1]
      : null;
  const previousLyrics = getPreviousLyrics();
if (showSpotify) {
  return <SpotifyMinimal onBack={() => {
    setShowSpotify(false);
    setIsPlaying(false);
    setCurrentTime(0);
  }} />;
}
  return (
    <div className="min-h-screen flex">
      <audio ref={audioRef} src={currentSong.url} />

      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-6 right-6 z-50 bg-white/10 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/20 transition border border-white/20"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </motion.button>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
            />
            <motion.div
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-96 bg-black/90 backdrop-blur-xl border-l border-white/10 z-40 p-8 overflow-y-auto"
            >
              <h2 className="text-3xl font-bold text-white mb-8 mt-16">
                Tu Biblioteca
              </h2>

              <div className="space-y-4">
                {songs.map((song) => (
                  <motion.div
                    key={song.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => selectSong(song)}
                    className={`p-4 rounded-xl cursor-pointer transition ${
                      currentSong.id === song.id
                        ? "bg-gradient-to-r from-purple-600 to-pink-600"
                        : "bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-white/10 p-3 rounded-lg ">
                        <Music size={24} color="white" style={{ background: "transparent"}} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold">
                          {song.title}
                        </h3>
                        <p className="text-gray-400 text-sm">{song.artist}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-12 p-6 bg-white/5 rounded-xl border border-white/10">
                <h3 className="text-white font-semibold mb-4">
                  Control de Volumen
                </h3>
                <div className="flex items-center gap-3">
                  <Volume2 size={20} className="text-gray-400" />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    className="flex-1 h-1 bg-gray-700 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #a855f7 0%, #ec4899 ${volume}%, #374151 ${volume}%, #374151 100%)`,
                    }}
                  />
                  <span className="text-xs text-gray-400 w-8">{volume}</span>
                </div>
              </div>
              <motion.div
                className="w-full max-w-2xl bg-black/40 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/10"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center mb-4">
                  <h2 className="text-xl font-bold text-white">
                    {currentSong.title}
                  </h2>
                  <p className="text-gray-400 text-sm">{currentSong.artist}</p>
                </div>

                <div className="mb-4">
                  <div
                    className="relative h-1 bg-gray-700 rounded-full overflow-hidden cursor-pointer"
                    onClick={handleProgressClick}
                  >
                    <motion.div
                      className="absolute h-full bg-gradient-to-r from-purple-500 to-pink-500"
                      style={{
                        width: `${
                          duration ? (currentTime / duration) * 100 : 0
                        }%`,
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
                    onClick={handleSkipBack}
                    className="text-white/70 hover:text-white transition"
                  >
                    <SkipBack size={24}  />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={togglePlay}
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
                    onClick={handleSkipForward}
                    className="text-white/70 hover:text-white transition"
                  >
                    <SkipForward size={24} />
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-hidden">
        <div className="flex-1 flex items-center justify-center w-full overflow-hidden">
          <div className="relative w-screen h-[500px] w flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-32  to-transparent pointer-events-none z-10" />

            <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-b from-transparent to-[#1E2125] pointer-events-none z-10" />
            <div className="flex-1 flex flex-col justify-end items-center w-full overflow-hidden">
              <AnimatePresence>
                {previousLyrics.map((lyric, index) => {
                  const opacity = 0.15 + (index / previousLyrics.length) * 0.25;
                  return (
                    <motion.div
                      key={`prev-${currentSong.lyrics.indexOf(lyric)}`}
                      initial={{ y: 30, opacity: 0 }}
                      animate={{
                        y: 0,
                        opacity: opacity,
                        scale: 0.88,
                      }}
                      exit={{ y: -30, opacity: 0 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                      className="text-white text-xl md:text-[2.5rem] font-grand text-center mb-4 px-4"
                    >
                      {lyric.text}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            <div className="my-8 relative w-3/4 mx-auto">
              <AnimatePresence mode="wait">
                {currentTime >= 57 && currentTime < 64 ? (
                  <motion.div
                    key="lottie"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 1 }}
                  >
                    <img
                      src="https://media.tenor.com/GFqwZAEW8KQAAAAi/principessamusi
                      cguitar.gif"
                      alt="imagen sincronizada"
                      className="w-full h-[30vh] object-contain  z-1"
                    />
                  </motion.div>
                ) : currentLyric ? (
                  <motion.div
                    key={currentLyricIndex}
                    initial={{ scale: 0.85, opacity: 0, y: 25 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.92, opacity: 0, y: -25 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="text-white"
                  >
                    <TypewriterLine text={currentLyric.text} isActive={true} />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-3xl text-gray-400 text-center"
                  >
                    Presiona play para comenzar
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="fixed bottom-0 left-0 transform -translate-x-1/2 text-center z-1"
            >
              <div className="flex flex-row justify-between w-screen items-center h-[80vh]">
                <BackgroundAnimations />
              </div>
            </motion.div>
            <div className="flex-1 flex flex-col justify-start items-center w-full">
              <AnimatePresence>
                {nextLyric && (
                  <motion.div
                    key={`next-${currentLyricIndex + 1}`}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.35 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.6,
                      ease: "easeInOut",
                      layout: { duration: 0.6 },
                    }}
                    className="text-white text-2xl md:text-[2.5rem] font-grand text-center mt-4 px-4"
                  >
                    {nextLyric.text}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
