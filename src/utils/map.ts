import { Coordinates } from "@/types/common";
import { Park } from "@/types/park";
import { Toilet } from "@/types/toilet";

/**
 * 座標を数値配列に変換
 */
export function toLatLng(
  facility: Park | (Toilet & { latitude: string; longitude: string })
): [number, number] {
  return [Number(facility.latitude), Number(facility.longitude)];
}

/**
 * 座標が有効かどうかを判定
 */
export const isValidCoordinates = (coords: Coordinates): boolean => {
  const lat = Number(coords.latitude);
  const lng = Number(coords.longitude);
  return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
};
