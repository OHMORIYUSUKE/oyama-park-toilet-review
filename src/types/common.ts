// 共通の型定義
export type Coordinates = {
  latitude: string;
  longitude: string;
};

export type BaseLocation = {
  name: string;
  address: string;
} & Coordinates;
