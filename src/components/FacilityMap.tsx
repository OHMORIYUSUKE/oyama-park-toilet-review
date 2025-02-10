"use client";

import { Park } from "@/types/park";
import { Toilet } from "@/types/toilet";
import { Feedback } from "@/types/feedback";
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  ZoomControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./FacilityMap.module.css";
import { useEffect, useState, useMemo } from "react";
import {
  OYAMA_CENTER,
  MARKER_ICONS,
  MARKER_IMAGES,
  DEFAULT_ZOOM,
} from "@/constants/map";
import Image from "next/image";
import { toLatLng } from "@/utils/map";
import { Modal, Snackbar, IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import L from "leaflet";
import { useRouter, useSearchParams } from "next/navigation";
import { FacilityDrawer } from "./FacilityDrawer";
import { Map as LeafletMap } from "leaflet";

interface LeafletElement extends HTMLElement {
  _leaflet_map?: LeafletMap;
}

/**
 * マップコンポーネントのプロパティ
 */
type FacilityMapProps = {
  /** 公園データの配列 */
  parks: Park[];
  /** トイレデータの配列 */
  toilets: Toilet[];
  /** フィードバックデータの配列 */
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

/**
 * 施設マップを表示するコンポーネント
 */
export function FacilityMap({ parks, toilets, feedbacks }: FacilityMapProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] =
    useState<SelectedFacility | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // マーカーの位置を事前計算
  const parkMarkers = useMemo(
    () =>
      parks.map((park) => ({
        ...park,
        position: toLatLng(park),
      })),
    [parks]
  );

  // 初期中心座標を設定
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

  // URLクエリパラメータから初期選択状態を設定
  useEffect(() => {
    const facilityType = searchParams.get("type");
    const facilityId = searchParams.get("id");

    if (facilityType && facilityId && isMounted) {
      if (facilityType === "park") {
        const park = parks.find((p) => p.id === facilityId);
        if (park) {
          setSelectedFacility({ type: "park", data: park });
          setDrawerOpen(true);
          // マップの表示位置を調整（中央に表示）
          const mapElement = document.querySelector(".leaflet-container");
          const map = (mapElement as LeafletElement)?._leaflet_map;
          if (map) {
            const point = toLatLng(park);
            map.setView(point, DEFAULT_ZOOM);
          }
        }
      } else if (facilityType === "toilet") {
        const toilet = toilets.find((t) => t.id === facilityId);
        if (toilet) {
          setSelectedFacility({ type: "toilet", data: toilet });
          setDrawerOpen(true);
          // マップの表示位置を調整（中央に表示）
          const mapElement = document.querySelector(".leaflet-container");
          const map = (mapElement as LeafletElement)?._leaflet_map;
          if (map) {
            const point = toLatLng(toilet);
            map.setView(point, DEFAULT_ZOOM);
          }
        }
      }
    }
  }, [searchParams, parks, toilets, isMounted]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // カスタムアイコンの設定を追加
  const selectedIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    iconSize: [45, 74],
    iconAnchor: [22, 74],
    popupAnchor: [1, -34],
    shadowUrl: "/images/marker-shadow.png",
    shadowSize: [74, 74],
  });

  const handleFacilitySelect = <T extends "park" | "toilet">(
    type: T,
    data: T extends "park" ? Park : Toilet
  ) => {
    setSelectedFacility({
      type,
      data: data as T extends "park" ? Park : Toilet,
    } as SelectedFacility);
    setDrawerOpen(true);

    // URLのクエリパラメータを更新
    const params = new URLSearchParams(searchParams.toString());
    params.set("type", type);
    params.set("id", data.id);
    router.push(`?${params.toString()}`, { scroll: false });

    // マップの表示位置を調整（中央に表示）
    const mapElement = document.querySelector(".leaflet-container");
    const map = (mapElement as LeafletElement)?._leaflet_map;
    if (map) {
      const point = toLatLng(data);
      map.setView(point, DEFAULT_ZOOM);
    }
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedFacility(null);

    // クエリパラメータをクリア
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
      ``, // 空行を入れて見やすく
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
    return null;
  }

  return (
    <>
      <div className={styles.header}>
        <h1>小山市の公園・トイレマップ</h1>
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <Image
            src={MARKER_IMAGES.PARK}
            alt="公園マーカー"
            width={20}
            height={33}
            unoptimized
          />
          <span>公園 ({parks.length}件)</span>
        </div>
        <div className={styles.legendItem}>
          <Image
            src={MARKER_IMAGES.TOILET}
            alt="トイレマーカー"
            width={20}
            height={33}
            unoptimized
          />
          <span>公衆トイレ ({toilets.length}件)</span>
        </div>
      </div>

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

          {/* 公園のマーカー */}
          {parkMarkers.map((park) => (
            <Marker
              key={park.id}
              position={park.position}
              icon={
                selectedFacility?.type === "park" &&
                selectedFacility.data.id === park.id
                  ? selectedIcon
                  : MARKER_ICONS.PARK
              }
              eventHandlers={{
                click: () => handleFacilitySelect("park", park),
              }}
            >
              <Tooltip
                permanent={false}
                direction="top"
                offset={[0, -40]}
                className={styles.tooltip}
              >
                {park.name}
              </Tooltip>
            </Marker>
          ))}

          {/* トイレのマーカー */}
          {toilets.map((toilet) => (
            <Marker
              key={toilet.id}
              position={[Number(toilet.latitude), Number(toilet.longitude)]}
              icon={
                selectedFacility?.type === "toilet" &&
                selectedFacility.data.id === toilet.id
                  ? selectedIcon
                  : MARKER_ICONS.TOILET
              }
              eventHandlers={{
                click: () => handleFacilitySelect("toilet", toilet),
              }}
            >
              <Tooltip
                permanent={false}
                direction="top"
                offset={[0, -40]}
                className={styles.tooltip}
              >
                {toilet.name}
              </Tooltip>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <FacilityDrawer
        open={drawerOpen}
        selectedFacility={selectedFacility}
        onClose={handleCloseDrawer}
        feedbacks={feedbacks}
        onCopyInfo={handleCopyInfo}
        onImageClick={setSelectedImage}
      />

      {/* コピー成功時の通知 */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="施設情報をクリップボードにコピーしました"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />

      {/* 画像モーダル */}
      <Modal
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "90vw",
            height: "90vh",
            bgcolor: "background.paper",
            p: 1,
            borderRadius: 1,
          }}
        >
          <IconButton
            onClick={() => setSelectedImage(null)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              bgcolor: "rgba(0,0,0,0.1)",
              zIndex: 1,
              "&:hover": {
                bgcolor: "rgba(0,0,0,0.2)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
          {selectedImage && (
            <Image
              src={selectedImage}
              alt="拡大画像"
              fill
              style={{ objectFit: "contain" }}
            />
          )}
        </Box>
      </Modal>
    </>
  );
}
