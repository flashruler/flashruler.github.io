# FTC Field Switcher

This guide walks you through the FTC Field Switcher for the first time, from setup to live testing.

The Field Switcher listens to the FTC scoring websocket stream and updates OBS scenes automatically when a `MATCH_LOAD` event arrives:

- `payload.field = 1` switches to **Scene A**
- `payload.field = 2` switches to **Scene B**

All other events and field values are ignored on purpose.

## What this feature does

The Stream Control page connects to two websocket systems at the same time:

1. **OBS WebSocket**: used to actually switch scenes.
2. **FTC scoring stream**: used to receive match events.

The bridge logic is simple and deterministic:

- It only reacts to `MATCH_LOAD` messages.
- It reads `payload.field`.
- It maps `1 -> Scene A` and `2 -> Scene B`.

This makes it safe to validate automation before wiring in additional API logic.

## Prerequisites

Before opening the page, make sure you have:

- OBS running on the same network as your browser.
- OBS WebSocket server enabled in OBS settings.
- Correct OBS host, port, and password.
- Two existing scene names in OBS (one for field 1 and one for field 2).
- FTC scoring system IP address.
- FTC event code used by the stream endpoint.

> [!TIP]
> Create scene names in OBS first and copy/paste them exactly. Scene matching is case-sensitive.

## Open the control page

1. Start your app (`pnpm dev`).
2. Open the navbar link for **Stream Control**.
3. Keep OBS visible so you can verify scene switches in real time.

## Step 1: Connect OBS

In the OBS section of Stream Control:

1. Choose protocol (`ws` or `wss`).
2. Enter OBS host and port.
3. Enter OBS password.
4. Enter:
   - **Scene A (value 1)**
   - **Scene B (value 2)**
5. Click **Connect**.

Expected result:

- Status changes to `connected`.
- Manual buttons `Switch Value 1` and `Switch Value 2` are enabled.

### Quick sanity check (recommended)

Use manual buttons once before connecting FTC:

- Click `Switch Value 1` and verify OBS moves to Scene A.
- Click `Switch Value 2` and verify OBS moves to Scene B.

If this fails, fix OBS credentials/scene names first.

## Step 2: Connect FTC scoring stream

In the FTC section of Stream Control:

1. Enter **Scoring IP**.
2. Keep port as `8080` unless your scoring server uses another port.
3. Enter **Event Code**.
4. Click **Connect FTC Stream**.

The generated endpoint format is:

```text
ws://<scoring-ip>:8080/api/v2/stream/?code=<eventCode>
```

Expected result:

- FTC status changes to `connected`.
- The page starts showing incoming FTC message diagnostics.

## Runtime behavior

When the app receives FTC messages:

- If `updateType` is not `MATCH_LOAD`, it is ignored.
- If `MATCH_LOAD` does not include numeric `payload.field`, it is ignored.
- If `payload.field` is `1`, app switches OBS to Scene A.
- If `payload.field` is `2`, app switches OBS to Scene B.
- Any other field value is ignored.

The page also suppresses duplicate switches if the same field repeats.

## Recommended first live test

1. Connect OBS first.
2. Connect FTC stream second.
3. Trigger or wait for a `MATCH_LOAD` for field 1.
4. Confirm OBS switches to Scene A.
5. Trigger or wait for a `MATCH_LOAD` for field 2.
6. Confirm OBS switches to Scene B.

If both work, your websocket bridge is ready for API-driven automation.

## Common errors and fixes

### OBS authentication failed (`4009`)

Symptoms:

- OBS logs show `Authentication failed`.
- App cannot move past OBS connection errors.

Fix:

- Re-check OBS password in WebSocket settings.
- Verify auth is enabled/disabled as expected.
- Re-type password carefully to avoid hidden whitespace.
- Click Apply in OBS and retry.

### FTC stream connection failed

Symptoms:

- FTC status goes to `error` or disconnects immediately.

Fix:

- Confirm scoring IP is reachable from your browser machine.
- Confirm port is correct (default `8080`).
- Verify the event code is valid for your scoring system.
- Verify websocket endpoint path is correct.

### Received mapped field but OBS did not switch

Symptoms:

- FTC diagnostics show field `1` or `2`, but no scene change.

Fix:

- Verify OBS is still connected.
- Verify Scene A / Scene B names exactly match OBS scene names.
- Check app action message for specific error text.

### Non-switching events

This is expected for events like `MATCH_START`, `MATCH_COMMIT`, `MATCH_POST`, and `MATCH_ABORT`.

Only `MATCH_LOAD` is used for scene switching in this version.

## Operational checklist

Before each stream:

- OBS connected and scenes verified manually.
- FTC IP and event code set.
- FTC stream status is connected.
- Last action message shows successful switch during a test `MATCH_LOAD`.

After reconnects or network changes:

- Reconnect OBS if needed.
- Reconnect FTC stream manually.
- Run one quick field 1/field 2 validation before going live.

## Current scope and next step

This version is intentionally focused on websocket reliability.

- It validates end-to-end FTC stream -> mapping -> OBS scene control.
- It does not include auto-reconnect/backoff.
- It does not yet consume additional API state.

Once this is stable for your event flow, the next step is wiring your API/data layer on top of the same scene mapping core.
