import { Marker, Tooltip } from "react-leaflet";
import { MARKER_ICONS } from "@/constants/map";
import { toLatLng } from "@/utils/map";
import { Park } from "@/types/park";
import { Toilet } from "@/types/toilet";
import { SelectedFacility, FacilityType } from "@/types/map";

type FacilityMarkersProps = {
  parks: Park[];
  toilets: Toilet[];
  selectedFacility: SelectedFacility | null;
  onSelect: (type: FacilityType, data: Park | Toilet) => void;
};

export function FacilityMarkers({
  parks,
  toilets,
  selectedFacility,
  onSelect,
}: FacilityMarkersProps) {
  return (
    <>
      {parks.map((park) => (
        <Marker
          key={park.id}
          position={toLatLng(park)}
          icon={
            selectedFacility?.data.id === park.id
              ? MARKER_ICONS.SELECTED
              : MARKER_ICONS.PARK
          }
          eventHandlers={{
            click: () => onSelect("park", park),
          }}
        >
          <Tooltip>{park.name}</Tooltip>
        </Marker>
      ))}
      {toilets.map((toilet) => (
        <Marker
          key={toilet.id}
          position={toLatLng(toilet)}
          icon={
            selectedFacility?.data.id === toilet.id
              ? MARKER_ICONS.SELECTED
              : MARKER_ICONS.TOILET
          }
          eventHandlers={{
            click: () => onSelect("toilet", toilet),
          }}
        >
          <Tooltip>{toilet.name}</Tooltip>
        </Marker>
      ))}
    </>
  );
}
