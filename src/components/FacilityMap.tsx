"use client";

import { Park } from "@/types/park";
import { Toilet } from "@/types/toilet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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

/**
 * マップコンポーネントのプロパティ
 */
type FacilityMapProps = {
  /** 公園データの配列 */
  parks: Park[];
  /** トイレデータの配列 */
  toilets: Toilet[];
};

/**
 * 施設マップを表示するコンポーネント
 */
export function FacilityMap({ parks, toilets }: FacilityMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [expandedPopupIds, setExpandedPopupIds] = useState<Set<string>>(
    new Set()
  );

  // マーカーの位置を事前計算
  const parkMarkers = useMemo(
    () =>
      parks.map((park) => ({
        ...park,
        position: toLatLng(park),
      })),
    [parks]
  );

  const togglePopupDetails = (id: string) => {
    const newExpandedIds = new Set(expandedPopupIds);
    if (expandedPopupIds.has(id)) {
      newExpandedIds.delete(id);
    } else {
      newExpandedIds.add(id);
    }
    setExpandedPopupIds(newExpandedIds);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
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
      <section className={styles.mapSection}>
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
                icon={MARKER_ICONS.PARK}
              >
                <Popup>
                  <h3>{park.name}</h3>
                  <p>{park.address}</p>
                  <a
                    href={`https://docs.google.com/forms/d/e/1FAIpQLSfAM_EddPsoFw4jmLZ9RQ9SKOWbWNnLdpIABZCh6FiTXJRsQw/viewform?usp=pp_url&entry.1276758939=${
                      "park_" + park.id
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    この公園の情報を提供する
                  </a>
                </Popup>
              </Marker>
            ))}

            {/* トイレのマーカー */}
            {toilets.map((toilet) => (
              <Marker
                key={toilet.no}
                position={[Number(toilet.latitude), Number(toilet.longitude)]}
                icon={MARKER_ICONS.TOILET}
              >
                <Popup>
                  <h3>{toilet.name}</h3>
                  <p>{toilet.address}</p>
                  <a
                    href={`https://docs.google.com/forms/d/e/1FAIpQLSfAM_EddPsoFw4jmLZ9RQ9SKOWbWNnLdpIABZCh6FiTXJRsQw/viewform?usp=pp_url&entry.1276758939=${
                      "toilet_" + toilet.no
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    このトイレの情報を提供する
                  </a>
                  <br />
                  <button
                    onClick={() => togglePopupDetails(toilet.no)}
                    className={styles.detailsButton}
                  >
                    {expandedPopupIds.has(toilet.no)
                      ? "詳細を閉じる"
                      : "詳細を見る"}
                  </button>
                  {expandedPopupIds.has(toilet.no) && (
                    <div className={styles.details}>
                      <div>
                        <h4>男性トイレ</h4>
                        <p>総数: {toilet.menTotal}個</p>
                        <p>- 小便器: {toilet.menUrinal}個</p>
                        <p>- 和式: {toilet.menJapanese}個</p>
                        <p>- 洋式: {toilet.menWestern}個</p>
                      </div>
                      <div>
                        <h4>女性トイレ</h4>
                        <p>総数: {toilet.womenTotal}個</p>
                        <p>- 和式: {toilet.womenJapanese}個</p>
                        <p>- 洋式: {toilet.womenWestern}個</p>
                      </div>
                      <div>
                        <h4>共用トイレ</h4>
                        <p>総数: {toilet.unisexTotal}個</p>
                        <p>- 和式: {toilet.unisexJapanese}個</p>
                        <p>- 洋式: {toilet.unisexWestern}個</p>
                      </div>
                      <div>
                        <h4>設備</h4>
                        <p>多機能トイレ: {toilet.multifunction}個</p>
                        <p>車椅子対応: {toilet.wheelchair}</p>
                        <p>乳幼児設備: {toilet.babyroom}</p>
                        <p>オストメイト: {toilet.ostomy}</p>
                      </div>
                    </div>
                  )}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </section>
    </>
  );
}
