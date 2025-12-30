import React, { useState, useEffect, useRef } from "react";
import "../App.css";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@nextui-org/react";
import {
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaForward,
  FaBackward,
} from "react-icons/fa";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

function Spotify() {
  const [currentSong, setCurrentSong] = useState(null);
  const [captions, setCaptions] = useState([]);
  const [currentCaption, setCurrentCaption] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  const songs = [
    {
      title: "Canción 1",
      url: "/media/empezar.mp3",
      captions: "/media/empezar.srt",
    },
    {
      title: "Canción 2",
      url: "/media/levante.mp3",
      captions: "/media/levante.srt",
    },
    {
      title: "Recomendada",
      url: "/media/huella.mp3",
      captions: "/media/huella.srt",
    },
    {
      title: "rock body",
      url: "/media/rockbody.mp3",
      captions: "/media/rockbody.srt",
    },
    {
      title: "I wanna be yours",
      url: "/media/iwannabeyours.mp3",
      captions: "/media/iwannabeyours.srt",
    },
  ];
  const timedImages = [
    {
      start: 2,
      end: 18,
      src: "https://media.tenor.com/GFqwZAEW8KQAAAAi/principessamusicguitar.gif",
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

  const handleSongSelect = (song) => {
    setCurrentSong(song);
    loadSubtitles(song.captions);
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    setCurrentCaption("");
  };

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const handleTimeUpdate = () => {
      const audio = audioRef.current;
      if (audio) {
        const currentTime = audio.currentTime;
        const duration = audio.duration || 0;

        setCurrentTime(currentTime);
        setProgress((currentTime / duration) * 100);

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

    const handleLoadedMetadata = () => {
      const audio = audioRef.current;
      if (audio) {
        setDuration(audio.duration);
      }
    };

    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    }

    return () => {
      if (audio) {
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      }
    };
  }, [captions]);

  const handleProgressChange = (event) => {
    const audio = audioRef.current;
    if (audio) {
      const newProgress = event.target.value;
      audio.currentTime = (audio.duration * newProgress) / 100;
      setProgress(newProgress);
    }
  };

  const handleSkipForward = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime += 10;
    }
  };

  const handleSkipBackward = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime -= 10;
    }
  };

  return (
    <>
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed top-5 right-5 z-50 bg-sipro text-bravvo px-4 py-2 rounded-full shadow-lg hover:bg-bravvo hover:text-sipro transition-all"
      >
        {isVisible ? "Cerrar " : "Abrir "}
      </button>

      <motion.div
        animate={{ x: isVisible ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="spotify-container fixed top-0 right-0 w-[80vw] md:w-[30vw] h-full bg-black/80 p-6 z-40 overflow-y-auto z-10"
      >
        <h1 className="font-grand text-green-500 font-bold text-5xl mb-5">
          Musiquita
        </h1>

        <div className="bg-transparent flex flex-col md:flex-row justify-between items-center ">
          {songs.map((song, index) => (
            <Button
              className=" flex  bg-transparent border-1 border-sipro text-sipro font-grand text-xl hover:bg-sipro hover:text-bravvo transition-all duration-300"
              key={index}
              onClick={() => handleSongSelect(song)}
            >
              {song.title}
            </Button>
          ))}
        </div>

        {currentSong && (
          <div className="player-controls ">
            <h2>Reproduciendo: {currentSong.title}</h2>
            <div className="audio-controls">
              <Button onClick={handleSkipBackward}>
                <FaBackward />
              </Button>
              <Button onClick={handlePlayPause}>
                {isPlaying ? <FaPause /> : <FaPlay />}
              </Button>
              <Button onClick={handleSkipForward}>
                <FaForward />
              </Button>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleProgressChange}
              className="progress-bar"
            />

            <div className="time-info">
              <span>
                {Math.floor(currentTime / 60)}:
                {("0" + Math.floor(currentTime % 60)).slice(-2)}
              </span>
              <span>
                {duration ? Math.floor(duration / 60) : "0"}:
                {duration ? ("0" + Math.floor(duration % 60)).slice(-2) : "00"}
              </span>
            </div>

            <audio ref={audioRef} src={currentSong.url} />
          </div>
        )}
      </motion.div>
      {isPlaying && (
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
            <img src="https://media.tenor.com/GFqwZAEW8KQAAAAi/principessamusicguitar.gif" alt="imagen sincronizada" className="w-[10vw] h-[20vh] object-contain mt-[500px] z-1" />
            <DotLottieReact
              src="https://lottie.host/9c2a1b0c-8856-4c3c-9c34-c28ca9e7abeb/R4HLMqBLL7.lottie"
              loop
              autoplay
              className="w-[100vw] h-[80vh] object-contain -mr-96 z-1"
            />
          </div>
        </motion.div>
      )}
      <AnimatePresence>
        {currentCaption && isPlaying && (
          <motion.div
            key={currentCaption}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.5, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="fixed flex items-center inset-0 transform -translate-x-1/2 text-center z-0 w-full"
          >
            <p className="text-9xl font-grand text-sipro w-[60vw] mx-auto">
              {currentCaption.split("(salto)").map((line, i) => (
                <span key={i}>
                  {line}
                  {i < currentCaption.split("(salto)").length - 1 && <br />}
                </span>
              ))}
            </p>
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
            className="fixed top-[300px] left-[750px] transform -translate-x-1/2 -translate-y-1/2 z-50 w-[400px] h-auto"
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default Spotify;
