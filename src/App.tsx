import GameRoom from './components/common/GameRoom';

export default function App() {
  return (
    <>
      <h1>App Component</h1>
      <GameRoom status="WAITING" name="같이 할 사람" players={1} />
      <GameRoom status="PLAYING" name="같이 할 사람" players={1} />
      <GameRoom
        status="WAITING"
        name="같이 할 사람"
        password="1234"
        players={1}
      />
      <GameRoom
        status="PLAYING"
        name="같이 할 사람"
        password="1234"
        players={1}
      />
    </>
  );
}
