import { Availability } from "@/types/toilet";

// 施設関連の定数を集約
export const FACILITY_TYPES = {
  PARK: "park",
  TOILET: "toilet",
} as const;

/** 施設タイプのラベル */
export const FACILITY_LABELS = {
  park: "公園",
  toilet: "トイレ",
} as const;

// 設備の有無の表示テキスト
export const AVAILABILITY_DISPLAY: Record<Availability, string> = {
  有: "あり",
  無: "なし",
} as const;
