import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import Signaling from "./services/signaling/socketConnection";

type ConnectionState = "connecting" | "connected" | "failed" | "disconnected";

const App: React.FC = () => {
  const [connectionState, setConnectionState] =
    useState<ConnectionState>("connecting");
  const [counter, setCounter] = useState(0);
  const [messages, setMessages] = useState<string[]>([]);
  const [inputText, setInputText] = useState("");
  const signaling = useRef(new Signaling()).current;

  const onConnected = () => {
    setConnectionState("connected");
  };

  const onCounterChanged = (count: number) => {
    setCounter(count);
  };

  const onMessagesUpdate = (data: string[]) => {
    setMessages(data);
  };

  useEffect(() => {
    const connect = async () => {
      await signaling.connect();
      const socket = signaling.socket;
      if (socket) {
        socket.on("connect", onConnected);
        socket.on("counter_update", onCounterChanged);
        socket.on("messages_update", onMessagesUpdate);
      }
    };

    connect();
    return signaling.disconnect;
  }, [signaling]);

  const onCountAction = () => {
    signaling.requestPromise("count");
  };

  const onSendMessageAction = (message: string) => {
    signaling.requestPromise("send_message", message);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (inputText.trim() !== "") {
        onSendMessageAction(inputText);
      }
      setInputText("");
    }
  };

  return (
    <div className="w-screen h-screen bg-slate-200 flex items-center justify-center">
      {/* Connecting */}
      {connectionState === "connecting" && <div>Connecting...</div>}
      {/* Main content */}
      {connectionState === "connected" && (
        <div className="flex flex-col items-center justify-center">
          {/* Counter */}
          <div className="flex flex-col items-center justify-center">
            <div
              className="text-8xl text-slate-600 font-thin mb-4 cursor-pointer select-none"
              onClick={onCountAction}
            >
              {counter}
            </div>
          </div>
          {/* Messages */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-80">
              <div className="flex flex-col space-y-4 w-full max-h-96 justify-end overflow-hidden">
                {messages.map((m) => {
                  return (
                    <div className="bg-slate-300 text-slate-600 px-4 py-3 rounded-xl">
                      {m}
                    </div>
                  );
                })}
              </div>
              <div className="absolute top-0 right-0 left-0 h-40 from-slate-200 bg-gradient-to-b" />
            </div>
            <input
              className="w-full h-10 mt-8 px-3 py-2 focus:outline-0 bg-slate-100 rounded-lg"
              onKeyDown={handleKeyDown}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
