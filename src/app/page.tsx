import { getParkData, getToiletData } from "@/lib/csv";
import { MapSection } from "@/components/MapSection";
import { getFeedbackData, transformFeedbackData } from "@/lib/feedback";

/**
 * トップページのコンポーネント
 */
export default async function Home() {
  const [parks, toilets, feedbackResponse] = await Promise.all([
    getParkData(),
    getToiletData(),
    getFeedbackData(),
  ]);

  // フィードバックデータを事前に変換
  const transformedFeedbacks = transformFeedbackData(feedbackResponse);

  return (
    <div>
      <main>
        <MapSection
          parks={parks}
          toilets={toilets}
          feedbacks={transformedFeedbacks}
        />
      </main>
    </div>
  );
}
