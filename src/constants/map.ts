import L from "leaflet";

/** 小山市の中心座標 */
export const OYAMA_CENTER: [number, number] = [36.3147, 139.8003];

/** マーカーアイコンの設定 */
export const MARKER_ICONS = {
  /** 公園用のマーカーアイコン */
  PARK: new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "/images/marker-shadow.png",
    shadowSize: [41, 41],
  }),
  /** トイレ用のマーカーアイコン */
  TOILET: new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "/images/marker-shadow.png",
    shadowSize: [41, 41],
  }),
  /** 選択中の施設用のマーカーアイコン */
  SELECTED: new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "/images/marker-shadow.png",
    shadowSize: [41, 41],
  }),
} as const;

/** マーカー画像のURL */
export const MARKER_IMAGES = {
  /** 公園マーカーの画像URL */
  PARK: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  /** トイレマーカーの画像URL */
  TOILET:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
} as const;

/** デフォルトのズームレベル */
export const DEFAULT_ZOOM = 13;
