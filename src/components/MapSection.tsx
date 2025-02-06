"use client";

import dynamic from "next/dynamic";
import { Park } from "@/types/park";
import { Toilet } from "@/types/toilet";

const DynamicMap = dynamic(
  () => import("@/components/FacilityMap").then((mod) => mod.FacilityMap),
  { ssr: false }
);

type MapSectionProps = {
  parks: Park[];
  toilets: Toilet[];
};

export function MapSection({ parks, toilets }: MapSectionProps) {
  return <DynamicMap parks={parks} toilets={toilets} />;
}
