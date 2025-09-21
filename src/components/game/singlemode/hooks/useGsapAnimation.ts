import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export const useGsapAnimation = () => {
  const imageRef = useRef<HTMLImageElement>(null);

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

  return { imageRef };
};