import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import Signaling from "./services/signaling/socketConnection";

type ConnectionState = "connecting" | "connected" | "failed" | "disconnected";

const App: React.FC = () => {
  const [connectionState, setConnectionState] =
    useState<ConnectionState>("connecting");
  const [counter, setCounter] = useState(0);
  const signaling = useRef(new Signaling()).current;

  const onConnected = () => {
    setConnectionState("connected");
  };

  const onCounterChanged = (count: number) => {
    setCounter(count);
  };

  useEffect(() => {
    const connect = async () => {
      await signaling.connect();
      const socket = signaling.socket;
      if (socket) {
        socket.on("connect", onConnected);
        socket.on("counter_update", onCounterChanged);
      }
    };

    connect();
    return signaling.disconnect;
  }, [signaling]);

  const onCountAction = () => {
    signaling.requestPromise("count");
  };

  return (
    <div>
      {connectionState === "connecting" && <div>Connecting...</div>}
      {connectionState === "connected" && (
        <div>
          {counter}
          <div>
            <span
              className="border rounded-md cursor-pointer"
              onClick={onCountAction}
            >
              Count
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
