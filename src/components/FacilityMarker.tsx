import { Marker, Tooltip } from "react-leaflet";
import { Park } from "@/types/park";
import { Toilet } from "@/types/toilet";
import { MARKER_ICONS } from "@/constants/map";
import { Icon } from "leaflet";
import styles from "./FacilityMap.module.css";
import { toLatLng } from "@/utils/map";

interface FacilityMarkerProps<T extends "park" | "toilet"> {
  type: T;
  data: T extends "park" ? Park : Toilet;
  isSelected: boolean;
  selectedIcon: Icon;
  onClick: (type: T, data: T extends "park" ? Park : Toilet) => void;
}

export function FacilityMarker<T extends "park" | "toilet">({
  type,
  data,
  isSelected,
  selectedIcon,
  onClick,
}: FacilityMarkerProps<T>) {
  const position = (
    type === "park" ? toLatLng(data as Park) : toLatLng(data as Toilet)
  ) as [number, number];

  return (
    <Marker
      key={data.id}
      position={position}
      icon={
        isSelected
          ? selectedIcon
          : MARKER_ICONS[type.toUpperCase() as "PARK" | "TOILET"]
      }
      eventHandlers={{
        click: () => onClick(type, data),
      }}
    >
      <Tooltip
        permanent={false}
        direction="top"
        offset={[0, -40]}
        className={styles.tooltip}
      >
        {data.name}
      </Tooltip>
    </Marker>
  );
}
