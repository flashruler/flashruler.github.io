type FtcPayload = {
  field?: unknown;
};

type FtcMessage = {
  updateType?: unknown;
  payload?: FtcPayload;
};

export type FtcFieldDecision = {
  updateType: string | null;
  field: number | null;
  mappedValue: 1 | 2 | null;
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
      reason: "Invalid JSON message.",
    };
  }

  if (!parsed || typeof parsed !== "object") {
    return {
      updateType: null,
      field: null,
      mappedValue: null,
      reason: "Unexpected message shape.",
    };
  }

  const message = parsed as FtcMessage;
  const updateType = typeof message.updateType === "string" ? message.updateType : null;

  if (updateType !== "MATCH_LOAD") {
    return {
      updateType,
      field: null,
      mappedValue: null,
      reason: "Ignored non-MATCH_LOAD event.",
    };
  }

  const fieldRaw = message.payload?.field;
  const field =
    typeof fieldRaw === "number"
      ? fieldRaw
      : typeof fieldRaw === "string" && fieldRaw.trim() !== ""
      ? Number(fieldRaw)
      : NaN;

  if (!Number.isFinite(field)) {
    return {
      updateType,
      field: null,
      mappedValue: null,
      reason: "MATCH_LOAD missing numeric payload.field.",
    };
  }

  if (field === 1 || field === 2) {
    return {
      updateType,
      field,
      mappedValue: field,
      reason: "Mapped MATCH_LOAD field to scene value.",
    };
  }

  return {
    updateType,
    field,
    mappedValue: null,
    reason: "Field value is not mapped (only 1 or 2).",
  };
}
