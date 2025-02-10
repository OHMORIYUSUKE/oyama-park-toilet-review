import Image from "next/image";
import { MARKER_IMAGES } from "@/constants/map";
import styles from "./FacilityMap.module.css";

interface FacilityLegendProps {
  parksCount: number;
  toiletsCount: number;
}

export function FacilityLegend({
  parksCount,
  toiletsCount,
}: FacilityLegendProps) {
  return (
    <div className={styles.legend}>
      <div className={styles.legendItem}>
        <Image
          src={MARKER_IMAGES.PARK}
          alt="公園マーカー"
          width={20}
          height={33}
          unoptimized
        />
        <span>公園 ({parksCount}件)</span>
      </div>
      <div className={styles.legendItem}>
        <Image
          src={MARKER_IMAGES.TOILET}
          alt="トイレマーカー"
          width={20}
          height={33}
          unoptimized
        />
        <span>公衆トイレ ({toiletsCount}件)</span>
      </div>
    </div>
  );
}
