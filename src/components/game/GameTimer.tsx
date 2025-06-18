import ProgressBar from '@ramonak/react-progress-bar';
import timer from '../../assets/images/icon_timer.svg';
import { useGameTimerStore } from '../../stores/gameMultiTimerStore';

export default function GameTimer({ totalTime }: { totalTime: number }) {
  const timeLeft = useGameTimerStore((state) => state.timeLeft);
  const percent = (timeLeft / totalTime) * 100;
  return (
    <div className="border-[2px] border-[color:var(--black)] rounded-[20px] w-5 h-[371px] relative flex justify-center items-center">
      <ProgressBar
        completed={percent}
        maxCompleted={100}
        height="16px"
        width="367px"
        baseBgColor="#ffffff"
        bgColor="linear-gradient(to right, #FFADAD 0%, #A7FFB9 100%)"
        isLabelVisible={false}
        borderRadius="20px"
        className="rotate-[-90deg]"
        animateOnRender={true}
        initCompletedOnAnimation={100}
      />
      <img src={timer} alt="타이머" className="absolute bottom-[-20px]" />
    </div>
  );
}
