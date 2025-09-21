import { useRef } from "react";
import Konva from "konva";
import DrawingColorPalette from "./DrawingColorPalette";
import DrawingCanvasStage from "./DrawingCanvasStage";
import { useDrawingState } from "./hooks/useDrawingState";
import { useDrawingHistory } from "./hooks/useDrawingHistory";
import { useFloodFill } from "./hooks/useFloodFill";
import { useDrawingEvents } from "./hooks/useDrawingEvents";
import DrawingToolsControls from "./DrawingToolsControls";

interface DrawingCanvasProps {
  onSubmit: (imageData: string) => void;
}

const DrawingCanvas = ({ onSubmit }: DrawingCanvasProps) => {
  const stageRef = useRef<Konva.Stage>(null);

  const {
    tool,
    setTool,
    lines,
    setLines,
    isDrawing,
    color,
    setColor,
    stroke,
    setStroke,
    hasImage,
    setHasImage,
  } = useDrawingState();

  const { addToHistory, handleUndo } = useDrawingHistory(
    lines,
    setLines,
    hasImage,
    setHasImage,
    stageRef
  );

  const { floodFill } = useFloodFill(
    stageRef,
    setLines,
    setHasImage,
    addToHistory
  );

  const { handleMouseDown, handleMouseMove, handleMouseUp } = useDrawingEvents(
    tool,
    color,
    stroke,
    lines,
    setLines,
    isDrawing,
    stageRef,
    addToHistory,
    floodFill
  );

  const handleSubmit = () => {
    const stage = stageRef.current;
    if (!stage) return;

    const imageDataURL = stage.toDataURL();
    onSubmit(imageDataURL);
  };

  return (
    <div>
      <div className="flex gap-[21px]">
        <DrawingColorPalette color={color} setColor={setColor} />
        <DrawingCanvasStage
          stageRef={stageRef}
          lines={lines}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
      </div>

      <DrawingToolsControls
        tool={tool}
        setTool={setTool}
        stroke={stroke}
        setStroke={setStroke}
        onUndo={handleUndo}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default DrawingCanvas;
