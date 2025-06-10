import { useRef, useState, useCallback } from "react";
import { Stage, Layer, Line } from "react-konva";
import Konva from "konva";
import hexToRgba from "hex-to-rgba";
import sketchBook from "../../assets/images/sketchbook.svg";
import pencil from "../../assets/images/icon_pencil.svg";
import eraser from "../../assets/images/icon_eraser.svg";
import paint from "../../assets/images/icon_paint.svg";
import back from "../../assets/images/icon_back_game.svg";
import Button from "../common/Button";

type LineData = {
  tool: string;
  points: number[];
  color: string;
  stroke: number;
};

type HistoryState = {
  type: "lines" | "image";
  data: LineData[] | string;
};

const DrawingCanvas = () => {
  const [tool, setTool] = useState<string>("pen");
  const [lines, setLines] = useState<LineData[]>([]);
  const isDrawing = useRef<boolean>(false);
  const [history, setHistory] = useState<HistoryState[]>([
    { type: "lines", data: [] },
  ]);
  const [historyStep, setHistoryStep] = useState<number>(0);
  const [color, setColor] = useState<string>("#1D1D1F");
  const [stroke, setStroke] = useState<number>(2);
  const [hasImage, setHasImage] = useState<boolean>(false);
  const stageRef = useRef<Konva.Stage>(null);

  const convertHexToRgba = (color: string): Uint8ClampedArray => {
    const rgbaStr = hexToRgba(color);
    const rgba = rgbaStr
      .substring(5, rgbaStr.length - 1)
      .split(",")
      .map((str: string) => Number(str));
    rgba[3] = rgba[3] * 255;
    return new Uint8ClampedArray(rgba);
  };

  const isValidSquare = (
    imageData: ImageData,
    x: number,
    y: number
  ): boolean => {
    return x >= 0 && x < imageData.width && y >= 0 && y < imageData.height;
  };

  const getPixelColor = (
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
  };

  const isSameColor = (a: Uint8ClampedArray, b: Uint8ClampedArray): boolean => {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
  };

  const setPixel = (
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
  };

  const floodFill = useCallback(
    (x: number, y: number, fillColor: string): void => {
      try {
        const stage = stageRef.current;
        if (!stage) return;

        const currentState: HistoryState = hasImage
          ? { type: "image", data: stage.toCanvas().toDataURL() }
          : { type: "lines", data: [...lines] };

        setHistory((currentHistory) => {
          const newHistory = currentHistory.slice(0, historyStep + 1);
          newHistory.push(currentState);
          return newHistory;
        });
        setHistoryStep((prev) => prev + 1);

        const canvas = stage.toCanvas();
        const ctx = canvas.getContext("2d");
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

            const newState: HistoryState = {
              type: "image",
              data: imageObj.src,
            };

            setHistory((currentHistory) => {
              const newHistory = [...currentHistory];
              newHistory.push(newState);
              return newHistory;
            });
            setHistoryStep((prev) => prev + 1);
          };
          imageObj.src = canvas.toDataURL();
        }
      } catch (error) {
        console.error("Flood fill error:", error);
      }
    },
    [lines, historyStep, hasImage]
  );

  const handleMouseDown = (
    e: Konva.KonvaEventObject<MouseEvent | TouchEvent>
  ): void => {
    console.log(e.evt);
    const stage = e.target.getStage();
    if (!stage) return;

    const pos = stage.getPointerPosition();
    if (!pos) return;

    if (tool === "paint") {
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
  };

  const handleMouseMove = (
    e: Konva.KonvaEventObject<MouseEvent | TouchEvent>
  ): void => {
    if (!isDrawing.current || tool === "paint") {
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
  };

  const handleMouseUp = (): void => {
    if (!isDrawing.current || tool === "paint") return;
    isDrawing.current = false;

    const newState: HistoryState = {
      type: "lines",
      data: [...lines],
    };

    setHistory((currentHistory) => {
      const newHistory = currentHistory.slice(0, historyStep + 1);
      newHistory.push(newState);
      return newHistory;
    });
    setHistoryStep(historyStep + 1);
  };

  const handleUndo = (): void => {
    if (historyStep <= 0) return;

    const newStep = historyStep - 1;
    const prevState = history[newStep];

    setHistoryStep(newStep);

    if (prevState.type === "lines") {
      setLines(prevState.data as LineData[]);
      setHasImage(false);

      const stage = stageRef.current;
      if (stage) {
        const layer = stage.getLayers()[0];
        layer.find("Image").forEach((img) => img.destroy());
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
  };

  return (
    <div>
      <div className="flex gap-[21px]">
        <div className="flex flex-col gap-[10px] mt-5">
          <div
            className={`w-6 h-6 bg-[#1D1D1F] rounded-full ${
              color === "#1D1D1F" && "outline-[5px] outline-[#C9C9C9]"
            } cursor-pointer`}
            onClick={() => setColor("#1D1D1F")}
          ></div>
          <div
            className={`w-6 h-6 bg-[#FF0000] rounded-full  ${
              color === "#FF0000" && "outline-[5px] outline-[#C9C9C9]"
            } cursor-pointer`}
            onClick={() => setColor("#FF0000")}
          ></div>
          <div
            className={`w-6 h-6 bg-[#DE651A] rounded-full  ${
              color === "#DE651A" && "outline-[5px] outline-[#C9C9C9]"
            } cursor-pointer`}
            onClick={() => setColor("#DE651A")}
          ></div>
          <div
            className={`w-6 h-6 bg-[#F4EC5A] rounded-full  ${
              color === "#F4EC5A" && "outline-[5px] outline-[#C9C9C9]"
            } cursor-pointer`}
            onClick={() => setColor("#F4EC5A")}
          ></div>
          <div
            className={`w-6 h-6 bg-[#34A853] rounded-full  ${
              color === "#34A853" && "outline-[5px] outline-[#C9C9C9]"
            } cursor-pointer`}
            onClick={() => setColor("#34A853")}
          ></div>
          <div
            className={`w-6 h-6 bg-[#2651FF] rounded-full  ${
              color === "#2651FF" && "outline-[5px] outline-[#C9C9C9]"
            } cursor-pointer`}
            onClick={() => setColor("#2651FF")}
          ></div>
          <div
            className={`w-6 h-6 bg-[#5865F2] rounded-full  ${
              color === "#5865F2" && "outline-[5px] outline-[#C9C9C9]"
            } cursor-pointer`}
            onClick={() => setColor("#5865F2")}
          ></div>
        </div>

        <div className="flex relative w-[610px] h-[410px] justify-center items-center pt-9">
          <div className="rounded-[6px] overflow-hidden border border-transparent">
            <Stage
              ref={stageRef}
              width={584}
              height={350}
              onMouseDown={handleMouseDown}
              onMousemove={handleMouseMove}
              onMouseup={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchMove={handleMouseMove}
              onTouchEnd={handleMouseUp}
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
      </div>

      <div className="flex justify-between w-[609px] ml-10">
        <div className="flex gap-7 justify-center">
          <div className="flex items-center px-[17px] w-[126px] justify-between">
            <div
              className={`w-3 h-3 bg-[#1D1D1F] rounded-full ${
                stroke === 2 && "outline-[5px] outline-[#C9C9C9]"
              } cursor-pointer`}
              onClick={() => setStroke(2)}
            ></div>
            <div
              className={`w-4.5 h-4.5 bg-[#1D1D1F] rounded-full ${
                stroke === 8 && "outline-[5px] outline-[#C9C9C9]"
              } cursor-pointer`}
              onClick={() => setStroke(8)}
            ></div>
            <div
              className={`w-6 h-6 bg-[#1D1D1F] rounded-full ${
                stroke === 15 && "outline-[5px] outline-[#C9C9C9]"
              } cursor-pointer`}
              onClick={() => setStroke(15)}
            ></div>
          </div>

          <div className="flex gap-7 items-center ">
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
              className={`w-[30px]  cursor-pointer opacity-50 ${
                tool === "paint" && "opacity-100"
              }`}
              onClick={() => setTool("paint")}
            />
            <img
              src={back}
              alt="되돌리기"
              className="w-7 cursor-pointer opacity-50 hover:opacity-100"
              onClick={handleUndo}
            />
          </div>
        </div>
        <Button>제출</Button>
      </div>
    </div>
  );
};

export default DrawingCanvas;
