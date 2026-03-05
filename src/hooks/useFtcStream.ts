import { useCallback, useEffect, useRef, useState } from "react";

export type FtcStreamStatus = "disconnected" | "connecting" | "connected" | "error";

export function useFtcStream() {
  const wsRef = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState<FtcStreamStatus>("disconnected");
  const [error, setError] = useState<string | null>(null);
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setStatus("disconnected");
    setError(null);
  }, []);

  const connect = useCallback(
    (url: string) => {
      disconnect();
      setStatus("connecting");
      setError(null);
      setLastMessage(null);

      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        if (wsRef.current !== ws) {
          return;
        }
        setStatus("connected");
      };

      ws.onmessage = (event) => {
        if (wsRef.current !== ws) {
          return;
        }
        setLastMessage(String(event.data));
      };

      ws.onerror = () => {
        if (wsRef.current !== ws) {
          return;
        }
        setStatus("error");
        setError("FTC stream connection failed.");
      };

      ws.onclose = () => {
        if (wsRef.current !== ws) {
          return;
        }

        wsRef.current = null;
        setStatus("disconnected");
      };
    },
    [disconnect]
  );

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  return {
    status,
    error,
    lastMessage,
    connect,
    disconnect,
  };
}
