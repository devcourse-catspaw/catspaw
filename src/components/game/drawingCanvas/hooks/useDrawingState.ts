import { useState, useRef } from 'react';

export type LineData = {
  tool: string;
  points: number[];
  color: string;
  stroke: number;
};

export type HistoryState = {
  type: 'lines' | 'image';
  data: LineData[] | string;
};

export const useDrawingState = () => {
  const [tool, setTool] = useState<string>('pen');
  const [lines, setLines] = useState<LineData[]>([]);
  const isDrawing = useRef<boolean>(false);
  const [color, setColor] = useState<string>('#1D1D1F');
  const [stroke, setStroke] = useState<number>(2);
  const [hasImage, setHasImage] = useState<boolean>(false);

  return {
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
  };
};