import { Stage, Layer, Line } from "react-konva";
import Konva from "konva";
import sketchBook from "../../../assets/images/sketchbook.svg";
import type { LineData } from "./hooks/useDrawingState";

interface DrawingCanvasStageProps {
  stageRef: React.RefObject<Konva.Stage | null>;
  lines: LineData[];
  onMouseDown: (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => void;
  onMouseMove: (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => void;
  onMouseUp: () => void;
}

export default function DrawingCanvasStage({
  stageRef,
  lines,
  onMouseDown,
  onMouseMove,
  onMouseUp,
}: DrawingCanvasStageProps) {
  return (
    <div className="flex relative w-[610px] h-[410px] justify-center items-center pt-9">
      <div className="rounded-[6px] overflow-hidden border border-transparent">
        <Stage
          ref={stageRef}
          width={580}
          height={350}
          onMouseDown={onMouseDown}
          onMousemove={onMouseMove}
          onMouseup={onMouseUp}
          onTouchStart={onMouseDown}
          onTouchMove={onMouseMove}
          onTouchEnd={onMouseUp}
        >
          <Layer>
            {lines.map((line: LineData, i: number) => (
              <Line
                key={i}
                points={line.points}
                stroke={line.color}
                strokeWidth={line.stroke}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
                globalCompositeOperation={
                  line.tool === "eraser" ? "destination-out" : "source-over"
                }
              />
            ))}
          </Layer>
        </Stage>
        <img
          src={sketchBook}
          alt="스케치북"
          className="absolute inset-0 w-full h-full -z-50"
        />
      </div>
    </div>
  );
}
