type CardBackProps = {
  title: string;
  features: string[];
};

const CARD_BASE_STYLE =
  "absolute inset-0 flex flex-col px-16 py-[62px] gap-[30px] border-[3px] rounded-[10px] shadow-[0px_6.59px_0px_#000000] backface-hidden";

export default function CardBack({ title, features }: CardBackProps) {
  return (
    <div className={`${CARD_BASE_STYLE} bg-blue-50 rotate-y-180`}>
      <div className="flex-1 flex flex-col justify-center items-center gap-4">
        <h2 className="text-xl font-bold text-center text-blue-600">{title}</h2>
        <ul className="text-sm space-y-2 text-center">
          {features.map((feature, index) => (
            <li key={index}>• {feature}</li>
          ))}
        </ul>
      </div>
      <button className="mt-auto py-2 px-4 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition-colors">
        시작하기
      </button>
    </div>
  );
}
