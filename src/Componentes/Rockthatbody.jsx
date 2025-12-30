import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function RockBody({ onBack }) {
  const [currentSong, setCurrentSong] = useState(null);
  const [captions, setCaptions] = useState([]);
  const [currentCaption, setCurrentCaption] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);
  const [currentImage, setCurrentImage] = useState(null);

  const song = {
    title: "rock body",
    url: "/media/rockbody.mp3",
    captions: "/media/rockbody.srt",
  };

  const timedImages = [
    {
      start: 20.5,
      end: 23,
      src: "/images/perrito.gif",
    },
    {
      start: 24.5,
      end: 28,
      src: "/images/6n2.gif",
    },
  ];

  const convertTimestampToSeconds = (timestamp) => {
    const [hours, minutes, seconds] = timestamp.split(":");
    const [secs, ms] = seconds.split(",");
    return (
      parseInt(hours, 10) * 3600 +
      parseInt(minutes, 10) * 60 +
      parseInt(secs, 10) +
      parseInt(ms, 10) / 1000
    );
  };

  const loadSubtitles = async (captionUrl) => {
    const response = await fetch(captionUrl);
    let text = await response.text();

    text = text.replace(/\r\n/g, "\n").trim();

    const regex =
      /(\d+)\n(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})\n([\s\S]*?)(?=\n{2,}|\n*$)/g;

    const parsedCaptions = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
      parsedCaptions.push({
        startTime: convertTimestampToSeconds(match[2]),
        endTime: convertTimestampToSeconds(match[3]),
        text: match[4].replace(/\n/g, " ").trim(),
      });
    }

    setCaptions(parsedCaptions);
  };

  useEffect(() => {
    setCurrentSong(song);
    loadSubtitles(song.captions);

    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.loop = true;
        audioRef.current.play();
      }
    }, 500);
  }, []);

  useEffect(() => {
    const handleTimeUpdate = () => {
      const audio = audioRef.current;
      if (audio) {
        const currentTime = audio.currentTime;
        setCurrentTime(currentTime);

        const currentSubtitle = captions.find(
          (caption) =>
            currentTime >= caption.startTime && currentTime <= caption.endTime
        );
        setCurrentCaption(currentSubtitle ? currentSubtitle.text : "");

        const activeImage = timedImages.find(
          (img) => currentTime >= img.start && currentTime <= img.end
        );
        setCurrentImage(activeImage ? activeImage.src : null);
      }
    };

    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener("timeupdate", handleTimeUpdate);
    }

    return () => {
      if (audio) {
        audio.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, [captions]);

  return (
    <div className="min-h-screen bg-gradient-to-br bg-[#1E2125] flex items-center justify-center relative overflow-hidden">
      {currentSong && <audio ref={audioRef} src={currentSong.url} />}

      {onBack && (
        <button
          onClick={onBack}
          className="fixed top-5 left-5 z-50 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full shadow-lg hover:bg-white/20 transition-all border border-white/20"
        >
          ← Volver
        </button>
      )}

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="fixed bottom-0 left-0 transform -translate-x-1/2 text-center z-1"
      >
        {/*<div className="flex flex-row justify-between w-screen items-center h-[80vh]">
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
        </div>*/ }
      </motion.div>

      <AnimatePresence>
        {currentCaption && (
          <motion.div
            key={currentCaption}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="fixed flex items-center inset-0 text-center z-10 pointer-events-none"
          >
            <div className="w-full px-8">
              <p className="text-5xl md:text-9xl text-sipro w-full mx-auto  ">
                {currentCaption.split("(salto)").map((line, i) => (
                  <span key={i} className="text-sipro font-grand">
                    {line}
                    {i < currentCaption.split("(salto)").length - 1 && <br />}
                  </span>
                ))}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {currentImage && (
          <motion.img
            key={currentImage}
            src={currentImage}
            alt="imagen sincronizada"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="fixed md:top-[20v] md:left-[40vw] left-20  z-50 w-[200px] md:w-[350px] h-auto"
          />
        )}
      </AnimatePresence>
    </div>
  );
}