export const STATUS = {
  READY: "READY",
  CAPTURING: "CAPTURING",
  ANALYZING: "ANALYZING",
  ANALYZED: "ANALYZED",
  RECYCLABLE: "RECYCLABLE",
  HAZARDOUS: "HAZARDOUS",
  ORGANIC: "ORGANIC",
  GENERAL: "GENERAL",
  FOOD_RESIDUE: "FOOD_RESIDUE",
  UNKNOWN: "UNKNOWN",
  THANK_YOU: "THANK_YOU",
};

export const STATUS_ROUTE = {
  [STATUS.READY]: "/ready",
  [STATUS.CAPTURING]: "/capture",
  [STATUS.ANALYZING]: "/analyzing",
  [STATUS.ANALYZED]: "/analyzed",
  [STATUS.RECYCLABLE]: "/result/recyclable",
  [STATUS.HAZARDOUS]: "/result/hazardous",
  [STATUS.ORGANIC]: "/result/organic",
  [STATUS.GENERAL]: "/result/general",
  [STATUS.FOOD_RESIDUE]: "/food-residue",
  [STATUS.UNKNOWN]: "/unknown",
  [STATUS.THANK_YOU]: "/thank-you",
};

export const STATUS_ORDER = [
  STATUS.READY,
  STATUS.CAPTURING,
  STATUS.ANALYZING,
  STATUS.ANALYZED,
  STATUS.RECYCLABLE,
  STATUS.HAZARDOUS,
  STATUS.ORGANIC,
  STATUS.GENERAL,
  STATUS.FOOD_RESIDUE,
  STATUS.UNKNOWN,
  STATUS.THANK_YOU,
];

export const TIMINGS_MS = {
  READY: 4200,
  CAPTURING: 4800,
  ANALYZED: 1800,
  RESULT: 6500,
  THANK_YOU: 5000,
  ANALYZE_MIN: 2800,
  ANALYZE_TIMEOUT: 12000,
};

export const RESULT_STATUSES = new Set([
  STATUS.RECYCLABLE,
  STATUS.HAZARDOUS,
  STATUS.ORGANIC,
  STATUS.GENERAL,
  STATUS.FOOD_RESIDUE,
  STATUS.UNKNOWN,
]);

export function resolveResultStatus(result) {
  if (!result || result.timeout || result.confidence < 0.5) {
    return STATUS.UNKNOWN;
  }

  if (result.foodResidue) {
    return STATUS.FOOD_RESIDUE;
  }

  if (result.type === "recyclable") {
    return STATUS.RECYCLABLE;
  }

  if (result.type === "hazardous") {
    return STATUS.HAZARDOUS;
  }

  if (result.type === "organic") {
    return STATUS.ORGANIC;
  }

  if (result.type === "general") {
    return STATUS.GENERAL;
  }

  return STATUS.UNKNOWN;
}
