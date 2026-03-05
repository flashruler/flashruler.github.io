import { useCallback, useEffect, useRef, useState } from "react";
import OBSWebSocket from "obs-websocket-js";

export type ObsConnectionStatus = "disconnected" | "connecting" | "connected" | "error";

export function useObsConnection() {
  const obsRef = useRef<OBSWebSocket | null>(null);
  const [status, setStatus] = useState<ObsConnectionStatus>("disconnected");
  const [error, setError] = useState<string | null>(null);

  const disconnect = useCallback(() => {
    if (obsRef.current) {
      obsRef.current.disconnect();
      obsRef.current = null;
    }
    setStatus("disconnected");
    setError(null);
  }, []);

  const connect = useCallback(
    async (url: string, password: string) => {
      disconnect();
      setStatus("connecting");
      setError(null);

      try {
        const obs = new OBSWebSocket();
        await obs.connect(url, password || undefined);
        obsRef.current = obs;
        setStatus("connected");
      } catch (connectionError) {
        setStatus("error");
        setError(
          connectionError instanceof Error
            ? connectionError.message
            : "Failed to connect to OBS WebSocket."
        );
      }
    },
    [disconnect]
  );

  const setProgramScene = useCallback(async (sceneName: string) => {
    if (!obsRef.current) {
      throw new Error("Not connected to OBS.");
    }

    await obsRef.current.call("SetCurrentProgramScene", { sceneName });
  }, []);

  useEffect(() => {
    return () => {
      if (obsRef.current) {
        obsRef.current.disconnect();
        obsRef.current = null;
      }
    };
  }, []);

  return {
    status,
    error,
    connect,
    disconnect,
    setProgramScene,
  };
}
