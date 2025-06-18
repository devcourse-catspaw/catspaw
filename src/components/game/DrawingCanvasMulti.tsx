import { useRef, useState, useCallback, useEffect } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import Konva from 'konva';
import hexToRgba from 'hex-to-rgba';
import sketchBook from '../../assets/images/sketchbook.svg';
import pencil from '../../assets/images/icon_pencil.svg';
import eraser from '../../assets/images/icon_eraser.svg';
import paint from '../../assets/images/icon_paint.svg';
import back from '../../assets/images/icon_back_game.svg';
import Button from '../common/Button';
import LabeledInput from '../common/LabeledInput';

type LineData = {
  tool: string;
  points: number[];
  color: string;
  stroke: number;
};

type HistoryState = {
  type: 'lines' | 'image';
  data: LineData[] | string;
};

const DrawingCanvasMulti = ({
  step,
  isComplete,
  timeLeft,
  // isTimeout,
  trigger,
  drawingUrl,
  // isZero,
  onSubmitDrawing,
  onSubmitWords,
  moveToNextTurn,
}: {
  step: string;
  isComplete: boolean;
  timeLeft: number;
  // isTimeout: boolean;
  trigger?: boolean;
  drawingUrl?: string;
  // isZero?: () => Promise<void>;
  onSubmitDrawing?: (imageData: string, isOver: boolean) => Promise<void>;
  onSubmitWords?: (answer: string, isOver: boolean) => Promise<void>;
  moveToNextTurn: () => Promise<void>;
}) => {
  const [tool, setTool] = useState<string>('pen');
  const [lines, setLines] = useState<LineData[]>([]);
  const isDrawing = useRef<boolean>(false);
  const [history, setHistory] = useState<HistoryState[]>([
    { type: 'lines', data: [] },
  ]);
  const [historyStep, setHistoryStep] = useState<number>(0);
  const [color, setColor] = useState<string>('#1D1D1F');
  const [stroke, setStroke] = useState<number>(2);
  const [hasImage, setHasImage] = useState<boolean>(false);
  const stageRef = useRef<Konva.Stage>(null);

  const [disabled, setDisabled] = useState(false);
  const [answer, setAnswer] = useState('');
  const [invalid, setInvalid] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  let lastEnterTime = 0;
  const keyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const now = Date.now();
      if (now - lastEnterTime < 500) return;

      lastEnterTime = now;

      e.preventDefault();
      checkValidation();
    }
  };

  const checkValidation = () => {
    if (disabled) return;

    setDisabled(true);
    if (answer.trim() !== '') {
      // console.log('제출합니당');
      handleSubmitAuto(false);
    } else setInvalid(true);

    setTimeout(() => setDisabled(false), 500);
  };

  const addToHistory = useCallback(
    (newState: HistoryState) => {
      setHistory((currentHistory) => {
        const newHistory = currentHistory.slice(0, historyStep + 1);
        newHistory.push(newState);

        if (newHistory.length > 30) {
          newHistory.shift();
          setHistoryStep(newHistory.length - 1);
        } else {
          setHistoryStep(historyStep + 1);
        }

        return newHistory;
      });
    },
    [historyStep]
  );

  const saveCurrentState = useCallback(() => {
    const currentState: HistoryState =
      hasImage && stageRef.current
        ? { type: 'image', data: stageRef.current.toCanvas().toDataURL() }
        : { type: 'lines', data: [...lines] };

    addToHistory(currentState);
  }, [lines, hasImage, addToHistory]);

  const convertHexToRgba = (color: string): Uint8ClampedArray => {
    const rgbaStr = hexToRgba(color);
    const rgba = rgbaStr
      .substring(5, rgbaStr.length - 1)
      .split(',')
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
    [saveCurrentState]
  );

  const handleMouseDown = (
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
  };

  const handleMouseMove = (
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
  };

  const handleMouseUp = (): void => {
    if (!isDrawing.current || tool === 'paint') return;
    isDrawing.current = false;

    const stage = stageRef.current;
    if (stage) {
      const currentImageData = stage.toCanvas().toDataURL();
      addToHistory({ type: 'image', data: currentImageData });
    }
  };

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
  }, [tool]);

  const handleUndo = (): void => {
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
  };

  const handleSubmit = async () => {
    if (disabled) return;

    setDisabled(true);
    handleSubmitAuto(false);

    setTimeout(() => setDisabled(false), 500);
  };

  const handleSubmitAuto = async (nowOver: boolean) => {
    if (step === 'DRAWING') {
      const stage = stageRef.current;
      if (!stage) return;

      const imageDataURL = stage.toDataURL({
        mimeType: 'image/png',
        quality: 1.0,
        pixelRatio: 1,
      });
      await onSubmitDrawing!(imageDataURL, nowOver);
    } else if (step === 'WORDS') {
      await onSubmitWords!(answer, nowOver);
    }
  };

  // const isZeros = async () => {
  //   if (!game) return;

  //   if (isSent) {
  //     console.log('isTimeout:', isTimeout);
  //     if (isTimeout) moveToNextTurn();
  //   } else {
  //     // if (!isComplete || isTimeout) await handleSubmitAuto();
  //     if (!isComplete) await handleSubmitAuto(true);
  //     // if (!isComplete && isTimeout) await handleSubmitAuto();

  //     const { data: dataGame, error: errorGame } = await supabase
  //       .from('games')
  //       .update({
  //         timeout_players: game.timeout_players + 1,
  //       })
  //       .eq('id', game?.id)
  //       .select();

  //     if (dataGame) {
  //       console.log('timeout players 업데이트 완료:', dataGame);
  //       setIsSent(true);

  //       // console.log('isTimeout:', isTimeout);
  //       // if (isTimeout) moveToNextTurn();
  //     }
  //     if (errorGame) {
  //       console.log('timeout players 업데이트 실패');
  //       console.error(errorGame);
  //       // setIsSent(true);
  //     }
  //   }
  // };

  useEffect(() => {
    // if (timeLeft <= 0) {
    if (timeLeft === 0) {
      // 수정
      // isZero();
      // console.log('DrawingCanvasMulti에서 시간 다 돼서 넘어감');
      (async () => {
        if (!isComplete || trigger) await handleSubmitAuto(false);

        console.log(
          '타이머 0 된 후, DrawingCanvasMulti에서 moveToNextTurn 호출되기 직전!'
        );
        await moveToNextTurn();
      })();
    }
  }, [timeLeft]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex gap-[21px]">
        {step === 'DRAWING' && (
          <div className="flex gap-[10px]">
            <div className="flex flex-col gap-[10px] mt-5">
              <div
                className={`w-6 h-6 bg-[#FF0000] rounded-full ${
                  color === '#FF0000' && 'outline-[5px] outline-[#C9C9C9]'
                } cursor-pointer`}
                onClick={() => setColor('#FF0000')}
              ></div>
              <div
                className={`w-6 h-6 bg-[#FF64B9] rounded-full  ${
                  color === '#FF64B9' && 'outline-[5px] outline-[#C9C9C9]'
                } cursor-pointer`}
                onClick={() => setColor('#FF64B9')}
              ></div>
              <div
                className={`w-6 h-6 bg-[#9500FF] rounded-full  ${
                  color === '#9500FF' && 'outline-[5px] outline-[#C9C9C9]'
                } cursor-pointer`}
                onClick={() => setColor('#9500FF')}
              ></div>
              <div
                className={`w-6 h-6 bg-[#A85134] rounded-full  ${
                  color === '#A85134' && 'outline-[5px] outline-[#C9C9C9]'
                } cursor-pointer`}
                onClick={() => setColor('#A85134')}
              ></div>
              <div
                className={`w-6 h-6 bg-[#34A853] rounded-full  ${
                  color === '#34A853' && 'outline-[5px] outline-[#C9C9C9]'
                } cursor-pointer`}
                onClick={() => setColor('#34A853')}
              ></div>
              <div
                className={`w-6 h-6 bg-[#3299FF] rounded-full  ${
                  color === '#3299FF' && 'outline-[5px] outline-[#C9C9C9]'
                } cursor-pointer`}
                onClick={() => setColor('#3299FF')}
              ></div>
            </div>
            <div className="flex flex-col gap-[10px] mt-5">
              <div
                className={`w-6 h-6 bg-[#1D1D1F] rounded-full ${
                  color === '#1D1D1F' && 'outline-[5px] outline-[#C9C9C9]'
                } cursor-pointer`}
                onClick={() => setColor('#1D1D1F')}
              ></div>
              <div
                className={`w-6 h-6 bg-[#ffffff] rounded-full border border-[#22222266]  ${
                  color === '#ffffff' && 'outline-[5px] outline-[#C9C9C9]'
                } cursor-pointer`}
                onClick={() => setColor('#ffffff')}
              ></div>
              <div
                className={`w-6 h-6 bg-[#8C8C8C] rounded-full  ${
                  color === '#8C8C8C' && 'outline-[5px] outline-[#C9C9C9]'
                } cursor-pointer`}
                onClick={() => setColor('#8C8C8C')}
              ></div>
              <div
                className={`w-6 h-6 bg-[#FEC5A7] rounded-full  ${
                  color === '#FEC5A7' && 'outline-[5px] outline-[#C9C9C9]'
                } cursor-pointer`}
                onClick={() => setColor('#FEC5A7')}
              ></div>
              <div
                className={`w-6 h-6 bg-[#F4EC5A] rounded-full  ${
                  color === '#F4EC5A' && 'outline-[5px] outline-[#C9C9C9]'
                } cursor-pointer`}
                onClick={() => setColor('#F4EC5A')}
              ></div>
              <div
                className={`w-6 h-6 bg-[#FF6D12] rounded-full  ${
                  color === '#FF6D12' && 'outline-[5px] outline-[#C9C9C9]'
                } cursor-pointer`}
                onClick={() => setColor('#FF6D12')}
              ></div>
            </div>
          </div>
        )}

        <div className="flex relative w-[610px] h-[410px] justify-center items-center pt-9">
          <div className="rounded-[6px] overflow-hidden border border-transparent">
            {step === 'DRAWING' ? (
              <Stage
                ref={stageRef}
                width={580}
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
                        line.tool === 'eraser'
                          ? 'destination-out'
                          : 'source-over'
                      }
                    />
                  ))}
                </Layer>
              </Stage>
            ) : (
              drawingUrl && (
                <img
                  src={drawingUrl}
                  alt="문제 그림"
                  className="w-[584px] h-[350px]"
                />
              )
            )}
            <img
              src={sketchBook}
              alt="스케치북"
              className="absolute inset-0 w-full h-full -z-50"
            />
          </div>
        </div>
      </div>
      {step === 'DRAWING' ? (
        <div className="flex justify-between w-[609px] ml-10 mr-1">
          <div className="flex gap-7 justify-center">
            <div className="flex items-center px-[17px] w-[126px] justify-between">
              <div
                className={`w-3 h-3 bg-[#1D1D1F] rounded-full ${
                  stroke === 2 && 'outline-[5px] outline-[#C9C9C9]'
                } cursor-pointer`}
                onClick={() => setStroke(2)}
              ></div>
              <div
                className={`w-4.5 h-4.5 bg-[#1D1D1F] rounded-full ${
                  stroke === 8 && 'outline-[5px] outline-[#C9C9C9]'
                } cursor-pointer`}
                onClick={() => setStroke(8)}
              ></div>
              <div
                className={`w-6 h-6 bg-[#1D1D1F] rounded-full ${
                  stroke === 15 && 'outline-[5px] outline-[#C9C9C9]'
                } cursor-pointer`}
                onClick={() => setStroke(15)}
              ></div>
            </div>

            <div className="flex gap-7 items-center ">
              <img
                src={pencil}
                alt="연필 도구"
                className={`w-[30px] cursor-pointer opacity-50 ${
                  tool === 'pen' && 'opacity-100'
                }`}
                onClick={() => setTool('pen')}
              />
              <img
                src={eraser}
                alt="지우개 도구"
                className={`w-[30px] cursor-pointer opacity-50 ${
                  tool === 'eraser' && 'opacity-100'
                }`}
                onClick={() => setTool('eraser')}
              />
              <img
                src={paint}
                alt="페인트 도구"
                className={`w-[30px]  cursor-pointer opacity-50 ${
                  tool === 'paint' && 'opacity-100'
                }`}
                onClick={() => setTool('paint')}
              />
              <img
                src={back}
                alt="되돌리기"
                className="w-7 cursor-pointer opacity-50 hover:opacity-100"
                onClick={handleUndo}
              />
            </div>
          </div>
          {isComplete ? (
            <Button
              disabled
              className="w-[113px] h-[49px] px-0 py-0 cursor-not-allowed"
            >
              제출 완료
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="w-[113px] h-[49px] px-0 py-0"
            >
              제출
            </Button>
          )}
        </div>
      ) : (
        <div className="flex justify-between gap-7 w-[595px] mr-2">
          <LabeledInput
            ref={inputRef}
            value={answer}
            readOnly={isComplete}
            onChange={(e) => {
              setAnswer(e.target.value);
              setInvalid(false);
            }}
            title=""
            invalidMessage="한 글자 이상 입력해주세요."
            isInvalid={invalid}
            onKeyDown={keyDownHandler}
            placeholder="정답 입력"
            className="w-[464px] text-[18px] mt-[-8px]"
          />
          {isComplete ? (
            <Button
              disabled
              className="w-[125px] h-[49px] px-3 cursor-not-allowed"
            >
              제출 완료
            </Button>
          ) : (
            <Button
              onClick={checkValidation}
              className="w-[113px] h-[49px] px-8"
            >
              제출
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default DrawingCanvasMulti;
