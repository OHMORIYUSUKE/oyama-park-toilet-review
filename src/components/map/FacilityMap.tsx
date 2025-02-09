"use client";

import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./FacilityMap.module.css";
import { useEffect, useState, useMemo } from "react";
import { OYAMA_CENTER, DEFAULT_ZOOM } from "@/constants/map";
import { toLatLng } from "@/utils/map";
import { FacilityMapProps } from "@/types/map";
import { FacilityDrawer } from "../drawer/FacilityDrawer";
import { FacilityMarkers } from "../markers/FacilityMarkers";
import { MapLegend } from "./MapLegend";
import { useRouter, useSearchParams } from "next/navigation";
import { useMapState } from "@/hooks/useMapState";

/**
 * 施設マップを表示するメインコンポーネント
 * @param parks - 公園データの配列
 * @param toilets - トイレデータの配列
 * @param feedbacks - フィードバックデータの配列
 */
export function FacilityMap({ parks, toilets, feedbacks }: FacilityMapProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);
  const {
    selectedFacility,
    drawerOpen,
    handleFacilitySelect,
    handleCloseDrawer,
  } = useMapState({ router, searchParams });

  const initialCenter = useMemo((): [number, number] => {
    const facilityType = searchParams.get("type");
    const facilityId = searchParams.get("id");

    if (facilityType && facilityId) {
      if (facilityType === "park") {
        const park = parks.find((p) => p.id === facilityId);
        if (park) {
          const [lat, lng] = toLatLng(park);
          return [lat, lng + 0.06];
        }
      } else if (facilityType === "toilet") {
        const toilet = toilets.find((t) => t.id === facilityId);
        if (toilet) {
          const [lat, lng] = toLatLng(toilet);
          return [lat, lng + 0.06];
        }
      }
    }
    return OYAMA_CENTER;
  }, [searchParams, parks, toilets]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <h1 className={styles.header}>小山市の公園・トイレマップ</h1>
      <MapLegend parkCount={parks.length} toiletCount={toilets.length} />

      <div className={styles.mapContainer}>
        <MapContainer
          center={initialCenter}
          zoom={DEFAULT_ZOOM}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <ZoomControl position="bottomright" />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FacilityMarkers
            parks={parks}
            toilets={toilets}
            selectedFacility={selectedFacility}
            onSelect={handleFacilitySelect}
          />
        </MapContainer>
      </div>

      <FacilityDrawer
        open={drawerOpen}
        facility={selectedFacility}
        feedbacks={feedbacks}
        onClose={handleCloseDrawer}
      />
    </>
  );
}
