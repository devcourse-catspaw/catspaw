import DrawingCanvas from '../components/game/DrawingCanvasMulti';
import SingleModeHeader from '../components/game/SingleModeHeader';

export default function SingleModePage() {
  return (
    <>
      <div className="w-full min-h-screen flex flex-col items-center px-20 pt-[14px] relative">
        <SingleModeHeader />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <DrawingCanvas />
        </div>
      </div>
    </>
  );
}
