"use client";

import dynamic from "next/dynamic";
import { Park } from "@/types/park";
import { Toilet } from "@/types/toilet";
import { Feedback } from "@/types/feedback";

const DynamicMap = dynamic(
  () => import("@/components/FacilityMap").then((mod) => mod.FacilityMap),
  { ssr: false }
);

type MapSectionProps = {
  parks: Park[];
  toilets: Toilet[];
  feedbacks: Feedback[];
};

export function MapSection({ parks, toilets, feedbacks }: MapSectionProps) {
  return <DynamicMap parks={parks} toilets={toilets} feedbacks={feedbacks} />;
}
