import { useReducer } from "react";

export type EnvelopeStage = "idle" | "opening" | "done";

export type EnvelopeAction = { type: "OPEN" } | { type: "COMPLETE" } | { type: "SKIP" };

function envelopeReducer(state: EnvelopeStage, action: EnvelopeAction): EnvelopeStage {
  switch (action.type) {
    case "OPEN":
      return state === "idle" ? "opening" : state;
    case "COMPLETE":
      return state === "opening" ? "done" : state;
    case "SKIP":
      return "done";
    default:
      return state;
  }
}

export function useEnvelopeState() {
  return useReducer(envelopeReducer, "idle" as EnvelopeStage);
}
