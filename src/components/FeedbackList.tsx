import { Feedback } from "../types/feedback";
import styles from "./FeedbackList.module.css";
import Image from "next/image";

type FeedbackListProps = {
  feedbacks: Feedback[];
};

export function FeedbackList({ feedbacks }: FeedbackListProps) {
  return (
    <section>
      <h2>最新の情報 ({feedbacks.length}件)</h2>
      <div className={styles.list}>
        {feedbacks.map((feedback) => (
          <div key={feedback.タイムスタンプ} className={styles.card}>
            <div className={styles.header}>
              <h3>{feedback["どのような情報ですか？"]}</h3>
              <time>
                {new Date(feedback.タイムスタンプ).toLocaleDateString("ja-JP")}
              </time>
            </div>
            <p>{feedback["詳細について教えてください"]}</p>
            {feedback["画像があればアプロードしてください"] && (
              <div className={styles.imageContainer}>
                <Image
                  src={feedback["画像があればアプロードしてください"]}
                  alt="報告画像"
                  width={300}
                  height={200}
                  objectFit="cover"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
