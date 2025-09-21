import pencil from "../../../assets/images/icon_pencil.svg";
import eraser from "../../../assets/images/icon_eraser.svg";
import paint from "../../../assets/images/icon_paint.svg";
import back from "../../../assets/images/icon_back_game.svg";
import Button from "../../common/Button";

interface DrawingToolsControlsProps {
  tool: string;
  setTool: (tool: string) => void;
  stroke: number;
  setStroke: (stroke: number) => void;
  onUndo: () => void;
  onSubmit: () => void;
}

export default function DrawingToolsControls({
  tool,
  setTool,
  stroke,
  setStroke,
  onUndo,
  onSubmit,
}: DrawingToolsControlsProps) {
  const strokeSizes = [
    { size: 2, className: "w-3 h-3" },
    { size: 8, className: "w-4.5 h-4.5" },
    { size: 15, className: "w-6 h-6" },
  ];

  return (
    <div className="flex justify-between w-[609px] ml-[72px]">
      <div className="flex gap-7 justify-center">
        <div className="flex items-center px-[17px] w-[126px] justify-between">
          {strokeSizes.map(({ size, className }) => (
            <div
              key={size}
              className={`${className} bg-[#1D1D1F] rounded-full ${
                stroke === size && "outline-[5px] outline-[#C9C9C9]"
              } cursor-pointer`}
              onClick={() => setStroke(size)}
            />
          ))}
        </div>

        <div className="flex gap-7 items-center">
          <img
            src={pencil}
            alt="연필 도구"
            className={`w-[30px] cursor-pointer opacity-50 ${
              tool === "pen" && "opacity-100"
            }`}
            onClick={() => setTool("pen")}
          />
          <img
            src={eraser}
            alt="지우개 도구"
            className={`w-[30px] cursor-pointer opacity-50 ${
              tool === "eraser" && "opacity-100"
            }`}
            onClick={() => setTool("eraser")}
          />
          <img
            src={paint}
            alt="페인트 도구"
            className={`w-[30px] cursor-pointer opacity-50 ${
              tool === "paint" && "opacity-100"
            }`}
            onClick={() => setTool("paint")}
          />
          <img
            src={back}
            alt="되돌리기"
            className="w-7 cursor-pointer opacity-50 hover:opacity-100"
            onClick={onUndo}
          />
        </div>
      </div>
      <Button onClick={onSubmit}>제출</Button>
    </div>
  );
}
