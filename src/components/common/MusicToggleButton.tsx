import yesMusic from "../../assets/images/icon_sound_bgm_yes.svg";
import noMusic from "../../assets/images/icon_sound_bgm_no.svg";
import yesEffect from "../../assets/images/icon_sound_effect_yes.svg";
import noEffect from "../../assets/images/icon_sound_effect_no.svg";
import { useState } from "react";

export default function MusicToggleButton() {
  const [isMusicOn, setIsMusicOn] = useState(true);
  const [isEffectOn, setIsEffectOn] = useState(true);

  return (
    <div className="relative">
      <div className="flex flex-col gap-4 absolute bottom-13 left-20 justify-center items-end">
        <button onClick={() => setIsMusicOn(!isMusicOn)}>
          <img
            src={isMusicOn ? yesMusic : noMusic}
            alt={isMusicOn ? "배경음악 켜짐" : "배경음악 꺼짐"}
          />
        </button>

        <button onClick={() => setIsEffectOn(!isEffectOn)}>
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
