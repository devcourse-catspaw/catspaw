import { useEffect, useCallback } from 'react';
import Konva from 'konva';
import type { HistoryState, LineData } from './useDrawingState';

export const useDrawingEvents = (
  tool: string,
  color: string,
  stroke: number,
  lines: LineData[],
  setLines: React.Dispatch<React.SetStateAction<LineData[]>>,
  isDrawing: React.MutableRefObject<boolean>,
  stageRef: React.RefObject<Konva.Stage | null>,
  addToHistory: (state: HistoryState) => void,
  floodFill: (x: number, y: number, fillColor: string) => void
) => {
  const handleMouseDown = useCallback((
    e: Konva.KonvaEventObject<MouseEvent | TouchEvent>
  ): void => {
    const stage = e.target.getStage();
    if (!stage) return;

    const pos = stage.getPointerPosition();
    if (!pos) return;

    if (tool === 'paint') {
      floodFill(Math.floor(pos.x), Math.floor(pos.y), color);
      return;
    }

    isDrawing.current = true;
    setLines([
      ...lines,
      {
        tool,
        points: [pos.x, pos.y],
        color: color,
        stroke: stroke,
      },
    ]);
  }, [tool, color, stroke, lines, setLines, isDrawing, floodFill]);

  const handleMouseMove = useCallback((
    e: Konva.KonvaEventObject<MouseEvent | TouchEvent>
  ): void => {
    if (!isDrawing.current || tool === 'paint') {
      return;
    }

    const stage = e.target.getStage();
    if (!stage) return;

    const point = stage.getPointerPosition();
    if (!point) return;

    setLines((currentLines: LineData[]) => {
      const newLines = [...currentLines];
      const lastLine = { ...newLines[newLines.length - 1] };
      lastLine.points = [...lastLine.points, point.x, point.y];
      newLines[newLines.length - 1] = lastLine;
      return newLines;
    });
  }, [tool, isDrawing, setLines]);

  const handleMouseUp = useCallback((): void => {
    if (!isDrawing.current || tool === 'paint') return;
    isDrawing.current = false;

    const stage = stageRef.current;
    if (stage) {
      const currentImageData = stage.toCanvas().toDataURL();
      addToHistory({ type: 'image', data: currentImageData });
    }
  }, [tool, isDrawing, stageRef, addToHistory]);

  useEffect(() => {
    const handleMouseUpOutside = () => {
      if (isDrawing.current && tool !== 'paint') {
        isDrawing.current = false;
      }
    };

    window.addEventListener('mouseup', handleMouseUpOutside);
    window.addEventListener('touchend', handleMouseUpOutside);

    return () => {
      window.removeEventListener('mouseup', handleMouseUpOutside);
      window.removeEventListener('touchend', handleMouseUpOutside);
    };
  }, [tool, isDrawing]);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
};