interface DrawingColorPaletteProps {
  color: string;
  setColor: (color: string) => void;
}

export default function DrawingColorPalette({
  color,
  setColor,
}: DrawingColorPaletteProps) {
  const colors1 = ['#FF0000', '#FF64B9', '#9500FF', '#A85134', '#34A853', '#3299FF'];
  const colors2 = ['#1D1D1F', '#ffffff', '#8C8C8C', '#FEC5A7', '#F4EC5A', '#FF6D12'];

  return (
    <div className="flex gap-[10px]">
      <div className="flex flex-col gap-[10px] mt-5">
        {colors1.map((colorValue) => (
          <div
            key={colorValue}
            className={`w-6 h-6 rounded-full cursor-pointer ${
              color === colorValue ? 'outline-[5px] outline-[#C9C9C9]' : ''
            }`}
            style={{ backgroundColor: colorValue }}
            onClick={() => setColor(colorValue)}
          />
        ))}
      </div>
      <div className="flex flex-col gap-[10px] mt-5">
        {colors2.map((colorValue) => (
          <div
            key={colorValue}
            className={`w-6 h-6 rounded-full cursor-pointer ${
              colorValue === '#ffffff' ? 'border border-[#22222266]' : ''
            } ${
              color === colorValue ? 'outline-[5px] outline-[#C9C9C9]' : ''
            }`}
            style={{ backgroundColor: colorValue }}
            onClick={() => setColor(colorValue)}
          />
        ))}
      </div>
    </div>
  );
}