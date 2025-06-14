import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Props = {
  children: React.ReactNode;
  delay?: number;
};

export default function ScrollItem({ children, delay = 0 }: Props) {
  const elRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    if (!elRef.current) return;

    const ctx = gsap.context(() => {
      const tween = gsap.fromTo(
        elRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay,
          // ease: 'power2.out',
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: elRef.current,
            start: 'top 100%',
            scroller: '#scroll-container',
            toggleActions: 'play none none none',
          },
        }
      );

      triggerRef.current = tween.scrollTrigger!;
    });

    return () => {
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    ScrollTrigger.refresh();
  }, []);

  return (
    <div ref={elRef} className="will-change-transform">
      {children}
    </div>
  );
}
