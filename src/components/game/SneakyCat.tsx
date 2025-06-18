import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import sneackycat from "../../assets/images/sneakycat.gif";
import { useNavigate } from "react-router";

export default function SneakyCat({
  setIsError,
}: {
  setIsError: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const imageRef = useRef<HTMLImageElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (imageRef.current) {
      gsap.set(imageRef.current, {
        opacity: 0,
        scale: 1,
      });

      gsap.to(imageRef.current, {
        opacity: 1,
        scale: 2,
        duration: 2,
        ease: "power2.out",
      });
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsError(false);
      navigate("/game");
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="w-full flex flex-col justify-center items-center gap-40">
      <h1 className="font-semibold text-3xl font-sinchon">
        앗! 도둑 고양이 등장! <br />
        그림을 낚아채 도망가버렸어요! <br />
        다시 멋지게 그려볼까요?
      </h1>
      <img
        ref={imageRef}
        src={sneackycat}
        alt="도둑 고양이"
        className="w-[380px]"
      />
    </div>
  );
}
