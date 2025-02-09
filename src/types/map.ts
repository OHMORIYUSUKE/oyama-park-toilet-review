import { Park } from "./park";
import { Toilet } from "./toilet";
import { Feedback } from "./feedback";

/** 施設タイプ */
export type FacilityType = "park" | "toilet";

/** 選択された施設の情報 */
export type SelectedFacility =
  | { type: "park"; data: Park }
  | { type: "toilet"; data: Toilet };

/** マップコンポーネントのプロパティ */
export type FacilityMapProps = {
  /** 公園データの配列 */
  parks: Park[];
  /** トイレデータの配列 */
  toilets: Toilet[];
  /** フィードバックデータの配列 */
  feedbacks: Feedback[];
};
