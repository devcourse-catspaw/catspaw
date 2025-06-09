import yesMusic from "../../assets/images/icon_sound_bgm_yes.svg";
import noMusic from "../../assets/images/icon_sound_bgm_no.svg";
import yesEffect from "../../assets/images/icon_sound_effect_yes.svg";
import noEffect from "../../assets/images/icon_sound_effect_no.svg";
import backgroundMusic from "../../assets/music/backgound_music.mp3";
import { useEffect, useRef, useState } from "react";

export default function MusicToggleButton() {
  const [isMusicOn, setIsMusicOn] = useState(false);
  const [isEffectOn, setIsEffectOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(backgroundMusic);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

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

        <button
          onClick={() => setIsEffectOn(!isEffectOn)}
          className="cursor-pointer"
        >
          <img
            src={isEffectOn ? yesEffect : noEffect}
            alt={isEffectOn ? "효과음 켜짐" : "효과음 꺼짐"}
            className="w-6"
          />
        </button>
      </div>
    </div>
  );
}
