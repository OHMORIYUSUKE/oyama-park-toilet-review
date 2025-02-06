import styles from "./page.module.css";
import { getParkData, getToiletData } from "@/lib/csv";
import { ParkList } from "@/components/ParkList";
import { ToiletList } from "@/components/ToiletList";
import { MapSection } from "@/components/MapSection";

/**
 * トップページのコンポーネント
 */
export default async function Home() {
  // 並列でデータを取得
  const [parks, toilets] = await Promise.all([getParkData(), getToiletData()]);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>小山市の公園・トイレマップ</h1>
        <MapSection parks={parks} toilets={toilets} />
        <div className={styles.grid}>
          <ParkList parks={parks} />
          <ToiletList toilets={toilets} />
        </div>
      </main>
    </div>
  );
}
