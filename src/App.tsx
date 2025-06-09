import ChatMessage from "./components/common/ChatMessage";

export default function App() {
  return (
    <>
      <h1>App Component</h1>
      <div className="w-full justify-center items-center flex flex-col">
        <ChatMessage />
      </div>
    </>
  );
}
