import { Coordinates } from "@/types/common";
import { LatLngTuple } from "leaflet";

/**
 * 座標を数値配列に変換
 */
export const toLatLng = (coords: Coordinates): LatLngTuple => [
  Number(coords.latitude),
  Number(coords.longitude),
];

/**
 * 座標が有効かどうかを判定
 */
export const isValidCoordinates = (coords: Coordinates): boolean => {
  const lat = Number(coords.latitude);
  const lng = Number(coords.longitude);
  return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
};
