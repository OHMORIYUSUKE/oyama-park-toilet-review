import styles from "./page.module.css";
import { getParkData, getToiletData } from "@/lib/csv";
import { ParkList } from "@/components/ParkList";
import { ToiletList } from "@/components/ToiletList";
import { MapSection } from "@/components/MapSection";
import { FeedbackList } from "@/components/FeedbackList";
import { getFeedbackData } from "@/lib/feedback";

/**
 * トップページのコンポーネント
 */
export default async function Home() {
  const [parks, toilets, feedbackResponse] = await Promise.all([
    getParkData(),
    getToiletData(),
    getFeedbackData(),
  ]);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>小山市の公園・トイレマップ</h1>
        <MapSection parks={parks} toilets={toilets} />
        <FeedbackList feedbacks={feedbackResponse.records} />
        <div className={styles.grid}>
          <ParkList parks={parks} />
          <ToiletList toilets={toilets} />
        </div>
      </main>
    </div>
  );
}
