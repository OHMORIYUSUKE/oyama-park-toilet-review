/**
 * 公衆トイレデータの型定義
 */
export type Availability = "有" | "無";

export type Toilet = {
  /** トイレ番号 */
  no: string;
  /** トイレ名称 */
  name: string;
  /** 住所 */
  address: string;
  /** 緯度 */
  latitude: string;
  /** 経度 */
  longitude: string;
  /** 男性トイレ総数 */
  menTotal: string;
  /** 男性トイレのタイプ */
  menUrinal: string;
  /** 男性トイレの日本語 */
  menJapanese: string;
  /** 男性トイレの西洋 */
  menWestern: string;
  /** 女性トイレ総数 */
  womenTotal: string;
  /** 女性トイレの日本語 */
  womenJapanese: string;
  /** 女性トイレの西洋 */
  womenWestern: string;
  /** 男女共用トイレ総数 */
  unisexTotal: string;
  /** 男女共用トイレの日本語 */
  unisexJapanese: string;
  /** 男女共用トイレの西洋 */
  unisexWestern: string;
  /** 多機能トイレ */
  multifunction: string;
  /** 車椅子対応 */
  wheelchair: Availability;
  /** ベビールーム */
  babyroom: Availability;
  /** オストロギア */
  ostomy: Availability;
};
