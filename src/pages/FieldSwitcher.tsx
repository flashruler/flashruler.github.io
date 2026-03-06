import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFtcStream } from "@/hooks/useFtcStream";
import { useObsConnection } from "@/hooks/useObsConnection";
import { getFieldSwitchDecision } from "@/lib/ftcStream";

const DEFAULT_HOST = "localhost";
const DEFAULT_PORT = "4455";
const DEFAULT_FTC_IP = "";
const DEFAULT_FTC_PORT = "";

export default function FieldSwitcher() {
  const [protocol, setProtocol] = useState<"ws" | "wss">("ws");
  const [host, setHost] = useState(DEFAULT_HOST);
  const [port, setPort] = useState(DEFAULT_PORT);
  const [password, setPassword] = useState("");
  const [sceneA, setSceneA] = useState("");
  const [sceneB, setSceneB] = useState("");
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [ftcIp, setFtcIp] = useState(DEFAULT_FTC_IP);
  const [ftcCode, setFtcCode] = useState("");
  const [ftcMessageInfo, setFtcMessageInfo] = useState<string | null>(null);
  const [lastAppliedField, setLastAppliedField] = useState<1 | 2 | null>(null);
  const [ftcFormError, setFtcFormError] = useState<string | null>(null);

  const { status, error, connect, disconnect, setProgramScene } = useObsConnection();
  const {
    status: ftcStatus,
    error: ftcError,
    lastMessage,
    connect: connectFtc,
    disconnect: disconnectFtc,
  } = useFtcStream();

  const connectionUrl = useMemo(() => {
    const normalizedHost = host.trim() || DEFAULT_HOST;
    const normalizedPort = port.trim() || DEFAULT_PORT;
    return `${protocol}://${normalizedHost}:${normalizedPort}`;
  }, [host, port, protocol]);

  const isConnected = status === "connected";
  const isConnecting = status === "connecting";
  const isFtcConnected = ftcStatus === "connected";

  const ftcUrl = useMemo(() => {
    const normalizedIp = ftcIp.trim() || DEFAULT_FTC_IP;
    const code = encodeURIComponent(ftcCode.trim());
    return `ws://${normalizedIp}/api/v2/stream/?code=${code}`;
  }, [ftcIp, ftcCode]);

  const handleConnect = async () => {
    setLastAction(null);
    await connect(connectionUrl, password);
  };

  const handleConnectFtc = () => {
    setFtcFormError(null);
    setFtcMessageInfo(null);

    if (!ftcCode.trim()) {
      setFtcFormError("Set a scoring event code before connecting FTC stream.");
      return;
    }

    connectFtc(ftcUrl);
  };

  const handleSwitchValue = async (value: 1 | 2) => {
    const sceneName = value === 1 ? sceneA.trim() : sceneB.trim();

    if (!sceneName) {
      setLastAction(`Set ${value === 1 ? "Scene A" : "Scene B"} name before switching.`);
      return;
    }

    try {
      await setProgramScene(sceneName);
      setLastAction(`Value ${value} switched to scene: ${sceneName}`);
      setLastAppliedField(value);
    } catch (sceneError) {
      setLastAction(
        sceneError instanceof Error ? sceneError.message : "Failed to switch OBS scene."
      );
    }
  };

  useEffect(() => {
    if (!lastMessage) {
      return;
    }

    const decision = getFieldSwitchDecision(lastMessage);
    const details = `updateType=${decision.updateType ?? "unknown"}, field=${
      decision.field ?? "n/a"
    } — ${decision.reason}`;
    setFtcMessageInfo(details);

    if (decision.mappedValue === null) {
      return;
    }

    if (!isConnected) {
      setLastAction(`Received mapped field ${decision.mappedValue}, but OBS is not connected.`);
      return;
    }

    if (lastAppliedField === decision.mappedValue) {
      // Note: We don't return early here anymore because an API override during MATCH_START might change the target
      // We will check lastAppliedField again before switching.
      console.log(`Currently on field ${lastAppliedField} - will evaluate further to see if override happens.`);
    }

    let targetField = decision.mappedValue;
    let targetScene = targetField === 1 ? sceneA.trim() : sceneB.trim();

    if (!targetScene) {
      setLastAction(`Received field ${targetField}, but target scene is not configured.`);
      return;
    }

    const handleFieldSwitch = async () => {
      const normalizedIp = ftcIp.trim() || DEFAULT_FTC_IP;
      const code = encodeURIComponent(ftcCode.trim());

      try {
        setLastAction(`Checking active match for event ${code}...`);
        
        const response = await fetch(`http://${normalizedIp}/api/v1/events/${code}/matches/active/`);
        let shouldSkip = false;
        let finalActionMessage = `${decision.updateType} field ${targetField} switched to scene: ${targetScene}`;
        
        if (response.ok) {
          const activeMatchData = await response.json();
          // Normalize the response into an array of matches
          const matches = Array.isArray(activeMatchData.matches) 
            ? activeMatchData.matches 
            : [activeMatchData];

          console.log("Active matches details:", matches);

          // Find if ANY match is currently playing
          const playingMatch = matches.find((match: any) => 
            match?.matchState === "AUTO" || match?.matchState === "TELEOP"
          );

          if (decision.updateType === "MATCH_START" || decision.updateType === "SHOW_MATCH") {
            const trueMatch = playingMatch || matches[0];
            const currentNumber = trueMatch?.matchNumber;
            const apiField = trueMatch?.field;
            const wsNumber = decision.matchNumber;

            console.log(`[${decision.updateType}] API match number: ${currentNumber}, WS match number: ${wsNumber}`);

            if (currentNumber !== undefined && wsNumber !== null && currentNumber !== wsNumber) {
              console.log(`Mismatch detected. Using API field (${apiField}) as truth instead of WS field.`);
              if (apiField === 1 || apiField === 2) {
                targetField = apiField as 1 | 2;
                targetScene = targetField === 1 ? sceneA.trim() : sceneB.trim();
                
                if (!targetScene) {
                  console.log("Overridden target scene is not configured, skipping.");
                  shouldSkip = true;
                } else if (targetField === lastAppliedField) {
                  console.log(`Overridden field ${targetField} is already active, skipping.`);
                  shouldSkip = true;
                } else {
                  finalActionMessage = `${decision.updateType} mismatch: Overrode WS with API truth, switching field ${targetField} to scene: ${targetScene}`;
                }
              }
            } else {
              // Same number, normal switch checking
              if (targetField === lastAppliedField) {
                console.log(`Already on field ${lastAppliedField}, skipping.`);
                shouldSkip = true;
              }
            }
          } else {
            // MATCH_LOAD logic
            if (targetField === lastAppliedField) {
              console.log(`Already on field ${lastAppliedField}, skipping.`);
              shouldSkip = true;
            } else if (playingMatch) {
              const currentNumber = playingMatch.matchNumber;
              const wsNumber = decision.matchNumber;

              console.log(`Found playing match number: ${currentNumber}, WS match number: ${wsNumber}`);

              if (currentNumber !== undefined && wsNumber !== null && currentNumber !== wsNumber) {
                shouldSkip = true;
                console.log("Blocking field switch: An active match is playing and does not match the WS matchNumber.");
              } else {
                console.log("Allowing field switch: Playing match number matches WS matchNumber.");
              }
            } else {
              console.log("Allowing field switch: No matches are in AUTO or TELEOP state.");
            }
          }
        } else {
          // If response not ok, fallback to simple check
          if (targetField === lastAppliedField) {
            shouldSkip = true;
          }
        }

        if (shouldSkip) {
          console.log("Switch explicitly blocked or redundant.");
          if (targetField === lastAppliedField) {
            setLastAction(`Already on field ${lastAppliedField}.`);
          } else {
            setLastAction(`Skipped switch during ${decision.updateType}: Active match blocked via API check.`);
          }
          return;
        }

        await setProgramScene(targetScene);
        setLastAppliedField(targetField);
        setLastAction(finalActionMessage);
      } catch (error) {
        setLastAction(error instanceof Error ? error.message : "Failed to switch OBS scene or fetch match status.");
      }
    };

    handleFieldSwitch();
  }, [isConnected, lastAppliedField, lastMessage, sceneA, sceneB, setProgramScene, ftcIp, ftcCode]);

  return (
    <div className="container mx-auto mt-8 px-4 max-w-4xl pb-8">
      <Card>
        <CardHeader>
          <CardTitle>FTC Field Switcher for OBS</CardTitle>
          <CardDescription>
            Automatic Field Switcher for FTC using OBS Websocket and Local FTC Scoring API.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant={isConnected ? "default" : status === "error" ? "destructive" : "secondary"}>
              Status: {status}
            </Badge>
            <span className="text-sm text-muted-foreground">Endpoint: {connectionUrl}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col gap-2 text-sm font-medium">
              Protocol
              <select
                value={protocol}
                onChange={(event) => setProtocol(event.target.value as "ws" | "wss")}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="ws">ws</option>
                <option value="wss">wss</option>
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium">
              Host
              <input
                value={host}
                onChange={(event) => setHost(event.target.value)}
                placeholder="localhost"
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium">
              Port
              <input
                value={port}
                onChange={(event) => setPort(event.target.value)}
                placeholder="4455"
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium">
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Optional"
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium">
              Field 1 Scene
              <input
                value={sceneA}
                onChange={(event) => setSceneA(event.target.value)}
                placeholder="Scene A name"
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium">
              Field 2 Scene
              <input
                value={sceneB}
                onChange={(event) => setSceneB(event.target.value)}
                placeholder="Scene B name"
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={handleConnect} disabled={isConnecting || isConnected}>
              {isConnecting ? "Connecting..." : "Connect"}
            </Button>
            <Button variant="secondary" onClick={disconnect} disabled={!isConnected && !isConnecting}>
              Disconnect
            </Button>
          </div>

          <hr className="border-border" />

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <Badge
                variant={
                  isFtcConnected ? "default" : ftcStatus === "error" ? "destructive" : "secondary"
                }
              >
                FTC Stream: {ftcStatus}
              </Badge>
              <span className="text-sm text-muted-foreground">Endpoint: {ftcUrl}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex flex-col gap-2 text-sm font-medium">
                Scoring IP
                <input
                  value={ftcIp}
                  onChange={(event) => setFtcIp(event.target.value)}
                  placeholder="127.0.0.1"
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium">
                Event Code
                <input
                  value={ftcCode}
                  onChange={(event) => setFtcCode(event.target.value)}
                  placeholder="Event code"
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                />
              </label>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={handleConnectFtc} disabled={ftcStatus === "connected" || ftcStatus === "connecting"}>
                {ftcStatus === "connecting" ? "Connecting FTC..." : "Connect FTC Stream"}
              </Button>
              <Button variant="secondary" onClick={disconnectFtc} disabled={ftcStatus === "disconnected"}>
                Disconnect FTC Stream
              </Button>
            </div>
          </div>


          {error && <p className="text-sm text-destructive">Connection error: {error}</p>}
          {ftcError && <p className="text-sm text-destructive">FTC stream error: {ftcError}</p>}
          {ftcFormError && <p className="text-sm text-destructive">{ftcFormError}</p>}
          {ftcMessageInfo && <p className="text-sm text-muted-foreground">FTC: {ftcMessageInfo}</p>}
          {lastAction && <p className="text-sm text-muted-foreground">{lastAction}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
