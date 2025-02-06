import { Availability } from "@/types/toilet";

// 施設関連の定数を集約
export const FACILITY_TYPES = {
  PARK: "park",
  TOILET: "toilet",
} as const;

export const FACILITY_LABELS = {
  [FACILITY_TYPES.PARK]: "公園",
  [FACILITY_TYPES.TOILET]: "公衆トイレ",
} as const;

// 設備の有無の表示形式
export const AVAILABILITY_DISPLAY: Record<Availability, string> = {
  有: "⭕",
  無: "❌",
} as const;
