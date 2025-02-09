"use client";

import { Park } from "@/types/park";
import { Toilet } from "@/types/toilet";
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
import { Drawer, IconButton, Typography, Box, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FeedbackIcon from "@mui/icons-material/Feedback";
import L from "leaflet";
import { Feedback } from "@/types/feedback";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WcIcon from "@mui/icons-material/Wc";
import AccessibleIcon from "@mui/icons-material/Accessible";
import { useRouter, useSearchParams } from "next/navigation";
import ShareIcon from "@mui/icons-material/Share";
import { Snackbar } from "@mui/material";
import { Modal } from "@mui/material";
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
  const initialCenter = useMemo(() => {
    const facilityType = searchParams.get("type");
    const facilityId = searchParams.get("id");

    if (facilityType && facilityId) {
      if (facilityType === "park") {
        const park = parks.find((p) => p.id === facilityId);
        if (park) {
          const point = toLatLng(park);
          return [point[0], point[1] + 0.06]; // 経度を少し右にずらす
        }
      } else if (facilityType === "toilet") {
        const toilet = toilets.find((t) => t.id === facilityId);
        if (toilet) {
          const point = toLatLng(toilet);
          return [point[0], point[1] + 0.06]; // 経度を少し右にずらす
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

  // サイドバーの表示部分を修正
  const facilityFeedbacks = useMemo(() => {
    if (!selectedFacility) return [];
    return feedbacks.filter(
      (feedback) => feedback.facilityId === selectedFacility.data.id
    );
  }, [feedbacks, selectedFacility]);

  const getFacilityFeedbacks = (facilityId: string) => {
    // feedbacksを日付の降順（新しい順）にソート
    return feedbacks
      .filter((feedback) => feedback.facilityId === facilityId)
      .sort((a, b) => {
        // timestampを比較して降順にソート
        return (
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      });
  };

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

  const handleImageClick = (url: string) => {
    setSelectedImage(url);
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

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        sx={{
          "& .MuiDrawer-paper": {
            width: {
              xs: "100%", // モバイルでは全幅
              sm: "600px", // タブレット以上で500px
              md: "700px", // PC以上で600px
            },
            boxSizing: "border-box",
          },
        }}
      >
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* ヘッダー部分（固定） */}
          <Box
            sx={{
              p: 3,
              pb: 0,
              position: "relative",
            }}
          >
            <IconButton
              onClick={handleCloseDrawer}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                bgcolor: "rgba(0,0,0,0.05)",
                "&:hover": {
                  bgcolor: "rgba(0,0,0,0.1)",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* スクロール可能なコンテンツ領域 */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 3,
              pt: 0,
            }}
          >
            {selectedFacility && (
              <>
                <Typography
                  variant="h5"
                  sx={{
                    mt: 3,
                    fontWeight: "bold",
                    borderBottom: "2px solid #2196f3",
                    pb: 1,
                  }}
                >
                  {selectedFacility.data.name}
                </Typography>

                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <LocationOnIcon sx={{ fontSize: 20 }} />
                  {selectedFacility.data.address}
                </Typography>

                {/* 施設名の下にコピーボタンを追加 */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mt: 2,
                    mb: 3,
                  }}
                >
                  <Button
                    variant="outlined"
                    size="medium"
                    startIcon={<ShareIcon />}
                    onClick={handleCopyInfo}
                  >
                    この施設の情報をコピー
                  </Button>
                </Box>

                {selectedFacility.type === "toilet" && (
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      bgcolor: "rgba(0,0,0,0.02)",
                      borderRadius: 2,
                      border: "1px solid rgba(0,0,0,0.05)",
                    }}
                  >
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: "bold" }}
                    >
                      トイレ情報
                    </Typography>
                    <Box>
                      {/* 男性トイレ情報 */}
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            color: "primary.main",
                            fontWeight: "bold",
                          }}
                        >
                          <WcIcon /> 男性トイレ
                        </Typography>
                        <Box
                          sx={{
                            ml: 3,
                            mt: 1,
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fit, minmax(120px, 1fr))",
                            gap: 1,
                          }}
                        >
                          <Box
                            sx={{
                              p: 1.5,
                              bgcolor: "white",
                              borderRadius: 1,
                              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                              textAlign: "center",
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              総数
                            </Typography>
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: "bold", color: "primary.main" }}
                            >
                              {selectedFacility.data.menTotal}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              p: 1.5,
                              bgcolor: "white",
                              borderRadius: 1,
                              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                              textAlign: "center",
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              小便器
                            </Typography>
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: "bold", color: "primary.main" }}
                            >
                              {selectedFacility.data.menUrinal}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              p: 1.5,
                              bgcolor: "white",
                              borderRadius: 1,
                              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                              textAlign: "center",
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              和式
                            </Typography>
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: "bold", color: "primary.main" }}
                            >
                              {selectedFacility.data.menJapanese}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              p: 1.5,
                              bgcolor: "white",
                              borderRadius: 1,
                              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                              textAlign: "center",
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              洋式
                            </Typography>
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: "bold", color: "primary.main" }}
                            >
                              {selectedFacility.data.menWestern}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      {/* 女性トイレ情報 */}
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            color: "#e91e63",
                            fontWeight: "bold",
                          }}
                        >
                          <WcIcon /> 女性トイレ
                        </Typography>
                        <Box
                          sx={{
                            ml: 3,
                            mt: 1,
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fit, minmax(120px, 1fr))",
                            gap: 1,
                          }}
                        >
                          <Box
                            sx={{
                              p: 1.5,
                              bgcolor: "white",
                              borderRadius: 1,
                              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                              textAlign: "center",
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              総数
                            </Typography>
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: "bold", color: "#e91e63" }}
                            >
                              {selectedFacility.data.womenTotal}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              p: 1.5,
                              bgcolor: "white",
                              borderRadius: 1,
                              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                              textAlign: "center",
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              和式
                            </Typography>
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: "bold", color: "#e91e63" }}
                            >
                              {selectedFacility.data.womenJapanese}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              p: 1.5,
                              bgcolor: "white",
                              borderRadius: 1,
                              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                              textAlign: "center",
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              洋式
                            </Typography>
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: "bold", color: "#e91e63" }}
                            >
                              {selectedFacility.data.womenWestern}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      {/* 設備情報 */}
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            color: "text.primary",
                            fontWeight: "bold",
                          }}
                        >
                          <AccessibleIcon /> バリアフリー設備
                        </Typography>
                        <Box
                          sx={{
                            ml: 3,
                            mt: 1,
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fit, minmax(120px, 1fr))",
                            gap: 1,
                          }}
                        >
                          {[
                            {
                              label: "多機能",
                              value: selectedFacility.data.multifunction + "個",
                            },
                            {
                              label: "車椅子",
                              value: selectedFacility.data.wheelchair,
                            },
                            {
                              label: "乳幼児",
                              value: selectedFacility.data.babyroom,
                            },
                            {
                              label: "オストメイト",
                              value: selectedFacility.data.ostomy,
                            },
                          ].map((item) => (
                            <Box
                              key={item.label}
                              sx={{
                                p: 1.5,
                                bgcolor: "white",
                                borderRadius: 1,
                                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                                textAlign: "center",
                              }}
                            >
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {item.label}
                              </Typography>
                              <Typography
                                variant="h6"
                                sx={{ fontWeight: "bold" }}
                              >
                                {item.value === "有"
                                  ? "⭕️"
                                  : item.value === "無"
                                  ? "❌"
                                  : item.value}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                )}

                {getFacilityFeedbacks(selectedFacility.data.id).length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: "bold" }}
                    >
                      情報提供
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      {getFacilityFeedbacks(selectedFacility.data.id).map(
                        (feedback, index) => (
                          <Box
                            key={index}
                            sx={{
                              p: 2,
                              bgcolor: "rgba(0,0,0,0.02)",
                              borderRadius: 2,
                              border: "1px solid rgba(0,0,0,0.05)",
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {new Date(feedback.timestamp).toLocaleString(
                                "ja-JP",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </Typography>
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: "bold" }}
                            >
                              {feedback.feedbackType}
                            </Typography>
                            <Typography variant="body2">
                              {feedback.details}
                            </Typography>
                            {feedback.imageUrls &&
                              feedback.imageUrls.length > 0 && (
                                <Box
                                  sx={{
                                    mt: 1,
                                    display: "grid",
                                    gap: 1,
                                    gridTemplateColumns:
                                      feedback.imageUrls.length === 1
                                        ? "1fr"
                                        : "repeat(auto-fit, minmax(120px, 1fr))",
                                    "& > div": {
                                      aspectRatio: "1",
                                      position: "relative",
                                      borderRadius: 2,
                                      overflow: "hidden",
                                    },
                                  }}
                                >
                                  {feedback.imageUrls.map((url, i) => (
                                    <div key={i}>
                                      <Image
                                        src={url}
                                        alt={`フィードバック画像 ${i + 1}`}
                                        fill
                                        style={{
                                          objectFit: "cover",
                                          cursor: "pointer",
                                        }}
                                        onClick={() => handleImageClick(url)}
                                      />
                                    </div>
                                  ))}
                                </Box>
                              )}
                          </Box>
                        )
                      )}
                    </Box>
                  </Box>
                )}
              </>
            )}
          </Box>

          {/* フッター部分（固定） */}
          <Box
            sx={{
              p: 3,
              pt: 2,
              borderTop: "1px solid rgba(0,0,0,0.05)",
              bgcolor: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(5px)",
            }}
          >
            <Button
              variant="contained"
              fullWidth
              startIcon={<FeedbackIcon />}
              href={`https://docs.google.com/forms/d/e/1FAIpQLSfAM_EddPsoFw4jmLZ9RQ9SKOWbWNnLdpIABZCh6FiTXJRsQw/viewform?usp=pp_url&entry.1276758939=${
                selectedFacility?.type === "park" ? "公園" : "トイレ"
              }&entry.653877169=${selectedFacility?.data.id}`}
              target="_blank"
              sx={{
                bgcolor: "#2196f3",
                "&:hover": {
                  bgcolor: "#1976d2",
                },
              }}
            >
              この施設の情報を提供する
            </Button>
          </Box>
        </Box>
      </Drawer>

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
