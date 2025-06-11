export default function DrawingPropmt({ topic }: { topic: string }) {
  return (
    <>
      <div className="flex w-[597px] h-[62px] border-[2px] border-[color:var(--black)] rounded-[6px] text-center items-center justify-center">
        <p className="font-semibold text-[18px] text-[color:var(--black)]">
          {topic}
        </p>
      </div>
    </>
  );
}
