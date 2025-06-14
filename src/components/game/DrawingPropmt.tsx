import { twMerge } from "tailwind-merge";

export default function DrawingPropmt({
  topic,
  className,
}: {
  topic: string;
  className?: string;
}) {
  return (
    <>
      <div
        className={twMerge(
          "flex w-[597px] h-[62px] border-[2px] border-[color:var(--black)] rounded-[6px] text-center items-center justify-center",
          className
        )}
      >
        <p className="font-semibold text-[18px] text-[color:var(--black)]">
          {topic}
        </p>
      </div>
    </>
  );
}
