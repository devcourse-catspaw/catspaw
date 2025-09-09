import manyKisu from '../../../assets/images/kisu_many.svg';
import justKisu from '../../../assets/images/kisu_.svg';
import { CardFront } from './CardFront';
import { CardBack } from './CardBack';

type GameModeSelectCardProps = {
  mode: 'single' | 'multi';
};

const cardData = {
  single: {
    icon: justKisu,
    title: '싱글모드',
    backTitle: '싱글 모드',
    description: '내 그림, AI가 맞힐까?',
    backDescription: '제한시간 3분 안에 가장 많은 제시어를 AI 가 맞히게 하기',
    steps: ['1. 제시어 랜덤 제공', '2. 그림을 그림', '3. AI가 정답을 맞힘'],
  },
  multi: {
    icon: manyKisu,
    title: '멀티모드',
    backTitle: '멀티 모드',
    description: '누가 더 잘 그릴까? 대결 시작!',
    backDescription: '누가 더 잘 그릴까? 대결 시작!',
    steps: [
      '1. 다른 플레이어가 그릴 제시어 설정',
      '2. 랜덤으로 제시어 받아 그림 그리기',
      '3. 각자 그린 그림 다른 플레이어에게 전달',
      '4. 해당 그림 맞히기',
      '5. 4번 맞힌 내용으로 다시 랜덤 제시어 돌리기',
      '6. 받은 제시어 그림 그리기',
      '7. 결과 확인하기! (이 부분이 꿀잼)',
    ],
  },
};

export default function GameModeSelectCard({ mode }: GameModeSelectCardProps) {
  const data = cardData[mode];

  return (
    <div className='group w-[298px] h-[392px] [perspective:1000px]'>
      <div className='relative w-full h-full transition-transform duration-600 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]'>
        <CardFront
          icon={data.icon}
          title={data.title}
          description={data.description}
        />
        <CardBack
          icon={data.icon}
          title={data.backTitle}
          description={data.description}
          backDescription={data.backDescription}
          steps={data.steps}
          mode={mode}
        />
      </div>
    </div>
  );
}
