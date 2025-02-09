import { Park } from "./park";
import { Toilet } from "./toilet";
import { Feedback } from "./feedback";

export type FacilityType = "park" | "toilet";

export type SelectedFacility =
  | { type: "park"; data: Park }
  | { type: "toilet"; data: Toilet };

export type FacilityMapProps = {
  parks: Park[];
  toilets: Toilet[];
  feedbacks: Feedback[];
};
