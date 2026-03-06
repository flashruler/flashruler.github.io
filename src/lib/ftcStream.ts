type FtcPayload = {
  field?: unknown;
  number?: unknown;
};

type FtcMessage = {
  updateType?: unknown;
  payload?: FtcPayload;
};

export type FtcFieldDecision = {
  updateType: string | null;
  field: number | null;
  mappedValue: 1 | 2 | null;
  matchNumber: number | null;
  reason: string;
};

export function getFieldSwitchDecision(rawMessage: string): FtcFieldDecision {
  let parsed: unknown;

  try {
    parsed = JSON.parse(rawMessage);
  } catch {
    return {
      updateType: null,
      field: null,
      mappedValue: null,
      matchNumber: null,
      reason: "Invalid JSON message.",
    };
  }

  if (!parsed || typeof parsed !== "object") {
    return {
      updateType: null,
      field: null,
      mappedValue: null,
      matchNumber: null,
      reason: "Unexpected message shape.",
    };
  }

  const message = parsed as FtcMessage;
  const updateType = typeof message.updateType === "string" ? message.updateType : null;

  if (!updateType || !["MATCH_LOAD", "MATCH_START", "SHOW_MATCH"].includes(updateType)) {
    return {
      updateType,
      field: null,
      mappedValue: null,
      matchNumber: null,
      reason: `Ignored unhandled event type: ${updateType || "unknown"}.`,
    };
  }

  const fieldRaw = message.payload?.field;
  const numberRaw = message.payload?.number;

  const field =
    typeof fieldRaw === "number"
      ? fieldRaw
      : typeof fieldRaw === "string" && fieldRaw.trim() !== ""
      ? Number(fieldRaw)
      : NaN;

  const matchNumber =
    typeof numberRaw === "number"
      ? numberRaw
      : typeof numberRaw === "string" && numberRaw.trim() !== ""
      ? Number(numberRaw)
      : null;

  if (!Number.isFinite(field)) {
    return {
      updateType,
      field: null,
      mappedValue: null,
      matchNumber,
      reason: "Missing numeric payload.field.",
    };
  }

  if (field === 1 || field === 2) {
    return {
      updateType,
      field,
      mappedValue: field,
      matchNumber,
      reason: "Mapped match field to scene value.",
    };
  }

  return {
    updateType,
    field,
    mappedValue: null,
    matchNumber,
    reason: "Field value is not mapped (only 1 or 2).",
  };
}
