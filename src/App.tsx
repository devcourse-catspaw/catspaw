import GameRoom from './components/common/GameRoom';

export default function App() {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <h1>App Component</h1>
      <GameRoom
        status="WAITING"
        name="같이 할 사람 같이 할 사람 같이 할 사람 같이 할 사람 같이 할 사람"
        players={3}
      />
      <hr className="my-3 w-[520px]" />
      <GameRoom status="PLAYING" name="같이 할 사람" players={4} />
      <hr className="my-3 w-[520px]" />
      <GameRoom
        status="WAITING"
        name="같이 할 사람"
        password="1234"
        players={3}
      />
      <hr className="my-3 w-[520px]" />
      <GameRoom
        status="PLAYING"
        name="같이 할 사람 같이 할 사람 같이 할 사람 같이 할 사람 같이 할 사람 같이 할 사람"
        password="1234"
        players={2}
      />
    </div>
  );
}
