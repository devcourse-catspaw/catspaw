type CardBackProps = {
  icon: string;
  title: string;
  description: string;
  backDescription: string;
  steps: string[];
  mode: string;
};

export function CardBack({
  icon,
  title,
  description,
  backDescription,
  steps,
  mode,
}: CardBackProps) {
  return (
    <div className="absolute inset-0 flex flex-col px-[39px] py-[46px] gap-[30px] border-[3px] rounded-[10px] shadow-[0px_6.59px_0px_#000000] bg-[color:var(--red)] [backface-visibility:hidden] [transform:rotateY(180deg)] justify-center cursor-pointer">
      <div className="flex gap-[10px]">
        <img src={icon} alt="기수 아이콘" className="invert w-[45px]" />
        <div>
          <h1 className="font-extrabold text-lg text-[color:var(--white)]">
            {title}
          </h1>
          <p className="font-extrabold text-xs text-[#ffbbbb]">{description}</p>
        </div>
      </div>

      <div className="text-[color:var(--white)] font-medium text-start">
        {mode === "single" ? (
          <div className="text-xs/[33px]">
            <h2 className="text-[color:var(--white)] font-extrabold text-xs/[22px] text-start">
              {backDescription}
            </h2>
            {steps.map((step, index) => (
              <p key={index}>{step}</p>
            ))}
          </div>
        ) : (
          <div className="text-[11px]/[32px]">
            {steps.map((step, index) => (
              <p key={index}>{step}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
