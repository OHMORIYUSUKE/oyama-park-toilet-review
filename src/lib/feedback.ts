import { Feedback, FeedbackResponse } from "../types/feedback";

/**
 * フィードバックデータを取得するためのAPIのURL
 */
const FEEDBACK_API_URL = process.env.NEXT_PUBLIC_FEEDBACK_API_URL as string;

if (!FEEDBACK_API_URL) {
  throw new Error("NEXT_PUBLIC_FEEDBACK_API_URL is not defined");
}

/**
 * フィードバックデータをAPIから取得する
 * @returns フィードバックデータのレスポンス
 */
export async function getFeedbackData(): Promise<FeedbackResponse> {
  try {
    const response = await fetch(FEEDBACK_API_URL, {
      method: "GET",
      next: { revalidate: 60 },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Failed to fetch feedback data:", error);
    return { status: "error", records: [] };
  }
}

/**
 * Google Formsのレスポンスの型定義
 */
type RawFeedbackRecord = {
  タイムスタンプ: string;
  "【自動で入力されます。変更しないでください】施設タイプ": "公園" | "トイレ";
  "どのような情報ですか？": string;
  詳細について教えてください: string;
  画像があればアプロードしてください: string;
  "【自動で入力されます。変更しないでください】施設ID": string;
};

/**
 * フィードバックデータを整形する
 * @param data - APIから取得した生のフィードバックデータ
 * @returns 整形済みのフィードバックデータ配列
 */
export function transformFeedbackData(data: FeedbackResponse): Feedback[] {
  return data.records
    .filter((record: RawFeedbackRecord) => record.タイムスタンプ)
    .map((record: RawFeedbackRecord) => ({
      timestamp: record.タイムスタンプ,
      facilityType:
        record["【自動で入力されます。変更しないでください】施設タイプ"],
      feedbackType: record["どのような情報ですか？"],
      details: record["詳細について教えてください"],
      imageUrls: Array.isArray(record["画像があればアプロードしてください"])
        ? record["画像があればアプロードしてください"]
        : record["画像があればアプロードしてください"]
        ? [record["画像があればアプロードしてください"]]
        : [],
      facilityId: record["【自動で入力されます。変更しないでください】施設ID"],
    }));
}
