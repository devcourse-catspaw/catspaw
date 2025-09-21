import { useCallback } from 'react';
import Konva from 'konva';
import hexToRgba from 'hex-to-rgba';
import type { HistoryState, LineData } from './useDrawingState';

export const useFloodFill = (
  stageRef: React.RefObject<Konva.Stage | null>,
  setLines: React.Dispatch<React.SetStateAction<LineData[]>>,
  setHasImage: React.Dispatch<React.SetStateAction<boolean>>,
  addToHistory: (state: HistoryState) => void
) => {
  const convertHexToRgba = useCallback((color: string): Uint8ClampedArray => {
    const rgbaStr = hexToRgba(color);
    const rgba = rgbaStr
      .substring(5, rgbaStr.length - 1)
      .split(',')
      .map((str: string) => Number(str));
    rgba[3] = rgba[3] * 255;
    return new Uint8ClampedArray(rgba);
  }, []);

  const isValidSquare = useCallback((
    imageData: ImageData,
    x: number,
    y: number
  ): boolean => {
    return x >= 0 && x < imageData.width && y >= 0 && y < imageData.height;
  }, []);

  const getPixelColor = useCallback((
    imageData: ImageData,
    x: number,
    y: number
  ): Uint8ClampedArray => {
    if (isValidSquare(imageData, x, y)) {
      const offset = (y * imageData.width + x) * 4;
      return new Uint8ClampedArray(imageData.data.slice(offset, offset + 4));
    } else {
      return new Uint8ClampedArray([255, 255, 255, 255]);
    }
  }, [isValidSquare]);

  const isSameColor = useCallback((a: Uint8ClampedArray, b: Uint8ClampedArray): boolean => {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
  }, []);

  const setPixel = useCallback((
    imageData: ImageData,
    x: number,
    y: number,
    color: Uint8ClampedArray
  ): void => {
    const offset = (y * imageData.width + x) * 4;
    imageData.data[offset + 0] = color[0];
    imageData.data[offset + 1] = color[1];
    imageData.data[offset + 2] = color[2];
    imageData.data[offset + 3] = color[3];
  }, []);

  const floodFill = useCallback(
    (x: number, y: number, fillColor: string): void => {
      try {
        const stage = stageRef.current;
        if (!stage) return;

        const canvas = stage.toCanvas();
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const imageData = ctx.getImageData(0, 0, 580, 350);
        const visited = new Uint8Array(imageData.width * imageData.height);
        const targetColor = getPixelColor(imageData, x, y);
        const fillColorArray = convertHexToRgba(fillColor);

        if (!isSameColor(targetColor, fillColorArray)) {
          const stack: Array<{ x: number; y: number }> = [{ x, y }];

          while (stack.length > 0) {
            const child = stack.pop();
            if (!child) return;

            if (!isValidSquare(imageData, child.x, child.y)) continue;

            const currentColor = getPixelColor(imageData, child.x, child.y);
            const visitedIndex = child.y * imageData.width + child.x;

            if (
              !visited[visitedIndex] &&
              isSameColor(currentColor, targetColor)
            ) {
              setPixel(imageData, child.x, child.y, fillColorArray);
              visited[visitedIndex] = 1;

              if (child.x + 1 < imageData.width)
                stack.push({ x: child.x + 1, y: child.y });
              if (child.x - 1 >= 0) stack.push({ x: child.x - 1, y: child.y });
              if (child.y + 1 < imageData.height)
                stack.push({ x: child.x, y: child.y + 1 });
              if (child.y - 1 >= 0) stack.push({ x: child.x, y: child.y - 1 });
            }
          }

          ctx.putImageData(imageData, 0, 0);

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

            setLines([]);
            setHasImage(true);

            const finalImageData = stage.toCanvas().toDataURL();
            addToHistory({ type: 'image', data: finalImageData });
          };
          imageObj.src = canvas.toDataURL();
        }
      } catch (error) {
        console.error('Flood fill error:', error);
      }
    },
    [stageRef, setLines, setHasImage, addToHistory, getPixelColor, convertHexToRgba, isSameColor, isValidSquare, setPixel]
  );

  return { floodFill };
};