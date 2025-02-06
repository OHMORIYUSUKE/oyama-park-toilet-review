import { FACILITY_LABELS } from "@/constants/facilities";
import Image from "next/image";
import { MARKER_IMAGES } from "@/constants/map";
import styles from "./MapLegend.module.css";

type MapLegendProps = {
  parkCount: number;
  toiletCount: number;
};

export function MapLegend({ parkCount, toiletCount }: MapLegendProps) {
  return (
    <div className={styles.legend}>
      <div className={styles.legendItem}>
        <Image
          src={MARKER_IMAGES.PARK}
          alt={`${FACILITY_LABELS.park}マーカー`}
          width={20}
          height={33}
          unoptimized
        />
        <span>{`${FACILITY_LABELS.park} (${parkCount}件)`}</span>
      </div>
      <div className={styles.legendItem}>
        <Image
          src={MARKER_IMAGES.TOILET}
          alt={`${FACILITY_LABELS.toilet}マーカー`}
          width={20}
          height={33}
          unoptimized
        />
        <span>{`${FACILITY_LABELS.toilet} (${toiletCount}件)`}</span>
      </div>
    </div>
  );
}
