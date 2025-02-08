"use client";

import { Park } from "@/types/park";
import { Toilet } from "@/types/toilet";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
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
  const [isMounted, setIsMounted] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] =
    useState<SelectedFacility | null>(null);

  // マーカーの位置を事前計算
  const parkMarkers = useMemo(
    () =>
      parks.map((park) => ({
        ...park,
        position: toLatLng(park),
      })),
    [parks]
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // カスタムアイコンの設定を追加
  const selectedIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "/images/marker-shadow.png",
    shadowSize: [41, 41],
  });

  // サイドバーの表示部分を修正
  const facilityFeedbacks = useMemo(() => {
    if (!selectedFacility) return [];
    return feedbacks.filter(
      (feedback) => feedback.facilityId === selectedFacility.data.id
    );
  }, [feedbacks, selectedFacility]);

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
          center={OYAMA_CENTER}
          zoom={DEFAULT_ZOOM}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
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
                click: () => {
                  setSelectedFacility({ type: "park", data: park as Park });
                  setDrawerOpen(true);
                },
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
                click: () => {
                  setSelectedFacility({
                    type: "toilet",
                    data: toilet as Toilet,
                  });
                  setDrawerOpen(true);
                },
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
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 400 },
            bgcolor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 0 20px rgba(0,0,0,0.1)",
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
              onClick={() => setDrawerOpen(false)}
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

                {facilityFeedbacks.length > 0 && (
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
                      {facilityFeedbacks.map((feedback, index) => (
                        <Box
                          key={index}
                          sx={{
                            p: 2,
                            bgcolor: "rgba(0,0,0,0.02)",
                            borderRadius: 2,
                            border: "1px solid rgba(0,0,0,0.05)",
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            {new Date(feedback.timestamp).toLocaleString()}
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
                          {feedback.imageUrl && (
                            <Box
                              sx={{
                                mt: 1,
                                position: "relative",
                                height: "200px",
                                borderRadius: 2,
                                overflow: "hidden",
                              }}
                            >
                              <Image
                                src={feedback.imageUrl}
                                alt="フィードバック画像"
                                fill
                                style={{ objectFit: "cover" }}
                              />
                            </Box>
                          )}
                        </Box>
                      ))}
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
    </>
  );
}
