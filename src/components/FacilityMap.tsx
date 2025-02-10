"use client";

import { Park } from "@/types/park";
import { Toilet } from "@/types/toilet";
import { Feedback } from "@/types/feedback";
import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./FacilityMap.module.css";
import { useEffect, useState, useMemo, useCallback } from "react";
import { OYAMA_CENTER, DEFAULT_ZOOM } from "@/constants/map";
import { toLatLng } from "@/utils/map";
import { Snackbar } from "@mui/material";
import L from "leaflet";
import { useRouter, useSearchParams } from "next/navigation";
import { Map as LeafletMap } from "leaflet";
import { FacilityDrawer } from "./FacilityDrawer";
import { ImageModal } from "./ImageModal";
import { FacilityLegend } from "./FacilityLegend";
import { FacilityHeader } from "./FacilityHeader";
import { FacilityMarker } from "./FacilityMarker";
import { GitHubLink } from "./GitHubLink";

interface LeafletElement extends HTMLElement {
  _leaflet_map?: LeafletMap;
}

type FacilityMapProps = {
  parks: Park[];
  toilets: Toilet[];
  feedbacks: Feedback[];
};

type SelectedFacility =
  | {
      type: "park";
      data: Park;
    }
  | {
      type: "toilet";
      data: Toilet;
    };

export function FacilityMap({ parks, toilets, feedbacks }: FacilityMapProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] =
    useState<SelectedFacility | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const parkMarkers = useMemo(
    () =>
      parks.map((park) => ({
        ...park,
        position: toLatLng(park),
      })),
    [parks]
  );

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

  const moveMapToFacility = useCallback((facility: Park | Toilet) => {
    const mapElement = document.querySelector(".leaflet-container");
    const map = (mapElement as LeafletElement)?._leaflet_map;
    if (map) {
      const point = toLatLng(facility);
      map.setView(point, DEFAULT_ZOOM);
    }
  }, []);

  const handleFacilitySelect = useCallback(
    <T extends "park" | "toilet">(
      type: T,
      data: T extends "park" ? Park : Toilet
    ) => {
      setSelectedFacility({ type, data } as SelectedFacility);
      setDrawerOpen(true);
      moveMapToFacility(data);
    },
    [moveMapToFacility]
  );

  useEffect(() => {
    const facilityType = searchParams.get("type") as "park" | "toilet" | null;
    const facilityId = searchParams.get("id");

    if (facilityType && facilityId && isMounted) {
      const facility =
        facilityType === "park"
          ? parks.find((p) => p.id === facilityId)
          : toilets.find((t) => t.id === facilityId);

      if (facility) {
        handleFacilitySelect(facilityType, facility);
      }
    }
  }, [searchParams, isMounted, handleFacilitySelect, parks, toilets]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const selectedIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    iconSize: [45, 74],
    iconAnchor: [22, 74],
    popupAnchor: [1, -34],
    shadowUrl: "/images/marker-shadow.png",
    shadowSize: [74, 74],
  });

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedFacility(null);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("type");
    params.delete("id");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleCopyInfo = async () => {
    if (!selectedFacility) return;

    const facility = selectedFacility.data;
    const facilityType = selectedFacility.type === "park" ? "公園" : "トイレ";

    const textToCopy = [
      `${facility.name}（${facilityType}）`,
      `住所：${facility.address}`,
      ``,
      `地図：${window.location.href}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(textToCopy);
      setSnackbarOpen(true);
    } catch (error) {
      console.error("コピーに失敗しました:", error);
    }
  };

  if (!isMounted) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <p>ロード中...</p>
      </div>
    );
  }

  return (
    <>
      <FacilityHeader />
      <FacilityLegend parksCount={parks.length} toiletsCount={toilets.length} />

      <div className={styles.mapContainer}>
        <MapContainer
          center={initialCenter}
          zoom={DEFAULT_ZOOM}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
          className={styles.mapContainer}
          zoomControl={false}
        >
          <ZoomControl position="bottomright" />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {parkMarkers.map((park) => (
            <FacilityMarker
              key={park.id}
              type="park"
              data={park}
              isSelected={
                selectedFacility?.type === "park" &&
                selectedFacility.data.id === park.id
              }
              selectedIcon={selectedIcon}
              onClick={handleFacilitySelect}
            />
          ))}

          {toilets.map((toilet) => (
            <FacilityMarker
              key={toilet.id}
              type="toilet"
              data={toilet}
              isSelected={
                selectedFacility?.type === "toilet" &&
                selectedFacility.data.id === toilet.id
              }
              selectedIcon={selectedIcon}
              onClick={handleFacilitySelect}
            />
          ))}
        </MapContainer>
        <GitHubLink />
      </div>

      <FacilityDrawer
        open={drawerOpen}
        selectedFacility={selectedFacility}
        onClose={handleCloseDrawer}
        feedbacks={feedbacks}
        onCopyInfo={handleCopyInfo}
        onImageClick={setSelectedImage}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="施設情報をクリップボードにコピーしました"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />

      <ImageModal
        imageUrl={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </>
  );
}
