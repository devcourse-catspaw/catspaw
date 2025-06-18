import { useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import yesMusic from "../../assets/images/icon_sound_bgm_yes.svg";
import noMusic from "../../assets/images/icon_sound_bgm_no.svg";
import backgroundMusic1 from "../../assets/music/background_music1.mp3";
import backgroundMusic2 from "../../assets/music/background_music2.mp3";

export default function MusicToggleButton() {
  const location = useLocation();
  const [isMusicOn, setIsMusicOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentMusicPath = useRef<string>("");

  useEffect(() => {
    const music2Paths = ["ai-answering", "single", "multi"];
    const path = location.pathname;
    const shouldUseMusic2 = music2Paths.some((keyword) =>
      path.includes(keyword)
    );
    const selectedMusic = shouldUseMusic2 ? backgroundMusic2 : backgroundMusic1;

    if (!audioRef.current) {
      audioRef.current = new Audio(selectedMusic);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
      currentMusicPath.current = selectedMusic;
    }

    if (currentMusicPath.current !== selectedMusic) {
      const isPlaying = !audioRef.current.paused;
      audioRef.current.pause();
      audioRef.current = new Audio(selectedMusic);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
      currentMusicPath.current = selectedMusic;
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }

    return () => {};
  }, [location.pathname]);

  const toggleMusic = () => {
    const newMusicState = !isMusicOn;
    setIsMusicOn(newMusicState);

    if (audioRef.current) {
      if (newMusicState) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  };

  return (
    <div className="relative">
      <div className="flex flex-col gap-4 absolute bottom-13 left-20 justify-center items-end">
        <button onClick={toggleMusic} className="cursor-pointer">
          <img
            src={isMusicOn ? yesMusic : noMusic}
            alt={isMusicOn ? "배경음악 켜짐" : "배경음악 꺼짐"}
          />
        </button>
      </div>
    </div>
  );
}
