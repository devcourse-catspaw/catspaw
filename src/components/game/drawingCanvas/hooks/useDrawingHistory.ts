import { useState, useCallback } from 'react';
import Konva from 'konva';
import type { HistoryState, LineData } from './useDrawingState';

export const useDrawingHistory = (
  lines: LineData[],
  setLines: React.Dispatch<React.SetStateAction<LineData[]>>,
  hasImage: boolean,
  setHasImage: React.Dispatch<React.SetStateAction<boolean>>,
  stageRef: React.RefObject<Konva.Stage | null>
) => {
  const [history, setHistory] = useState<HistoryState[]>([
    { type: 'lines', data: [] },
  ]);
  const [historyStep, setHistoryStep] = useState<number>(0);

  const addToHistory = useCallback(
    (newState: HistoryState) => {
      setHistory((currentHistory) => {
        const newHistory = currentHistory.slice(0, historyStep + 1);
        newHistory.push(newState);

        if (newHistory.length > 30) {
          newHistory.shift();
          setHistoryStep(newHistory.length - 1);
        } else {
          setHistoryStep(newHistory.length - 1);
        }

        return newHistory;
      });
    },
    [historyStep]
  );

  const handleUndo = useCallback((): void => {
    if (historyStep <= 0) return;

    const newStep = historyStep - 1;
    const prevState = history[newStep];

    setHistoryStep(newStep);

    if (prevState.type === 'lines') {
      setLines(prevState.data as LineData[]);
      setHasImage(false);

      const stage = stageRef.current;
      if (stage) {
        const layer = stage.getLayers()[0];
        layer.find('Image').forEach((img) => img.destroy());
        layer.batchDraw();
      }
    } else {
      const imageObj = new Image();
      imageObj.onload = () => {
        const stage = stageRef.current;
        if (!stage) return;

        const layer = stage.getLayers()[0];
        layer.destroyChildren();

        const konvaImage = new Konva.Image({
          image: imageObj,
          x: 0,
          y: 0,
          width: 580,
          height: 350,
        });
        layer.add(konvaImage);
        layer.batchDraw();
      };
      imageObj.src = prevState.data as string;

      setLines([]);
      setHasImage(true);
    }
  }, [historyStep, history, setLines, setHasImage, stageRef]);

  return {
    addToHistory,
    handleUndo,
  };
};