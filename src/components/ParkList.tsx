import { Park } from "@/types/park";
import styles from "@/app/page.module.css";

/**
 * 公園リストのプロパティ
 */
type ParkListProps = {
  /** 表示する公園データの配列 */
  parks: Park[];
};

/**
 * 公園リストを表示するコンポーネント
 */
export function ParkList({ parks }: ParkListProps) {
  return (
    <section>
      <h2>公園一覧 ({parks.length}件)</h2>
      <div className={styles.list}>
        {parks.map((park) => (
          <div key={park.id} className={styles.card}>
            <h3>{park.name}</h3>
            <p>住所: {park.address}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
