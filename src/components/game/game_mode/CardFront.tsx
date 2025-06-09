type CardFrontProps = {
  icon: string;
  title: string;
  description: string;
};

export function CardFront({ icon, title, description }: CardFrontProps) {
  return (
    <div className="absolute inset-0 flex flex-col px-16 py-[62px] gap-[30px] border-[3px] rounded-[10px] shadow-[0px_6.59px_0px_#000000] bg-white [backface-visibility:hidden] cursor-pointer">
      <img src={icon} alt={`${title} 아이콘`} />
      <h1 className="text-lg font-extrabold text-center">{title}</h1>
      <p className="text-sm font-medium text-center">{description}</p>
    </div>
  );
}
