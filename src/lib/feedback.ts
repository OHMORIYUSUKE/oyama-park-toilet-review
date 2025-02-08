import { Feedback, FeedbackResponse } from "../types/feedback";

const FEEDBACK_API_URL =
  "https://script.google.com/macros/s/AKfycbzW1mNVDhmpHyYGad1AhIAH3wzC1kfXu95vH8UNIUzOAtk1PwhpXaMy5_LreHQUAmIdbQ/exec";

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

type RawFeedbackRecord = {
  タイムスタンプ: string;
  "【自動で入力されます。変更しないでください】施設タイプ": "公園" | "トイレ";
  "どのような情報ですか？": string;
  詳細について教えてください: string;
  画像があればアプロードしてください: string;
  "【自動で入力されます。変更しないでください】施設ID": string;
};

export function transformFeedbackData(data: FeedbackResponse): Feedback[] {
  return data.records
    .filter((record: RawFeedbackRecord) => record.タイムスタンプ)
    .map((record: RawFeedbackRecord) => ({
      timestamp: record.タイムスタンプ,
      facilityType:
        record["【自動で入力されます。変更しないでください】施設タイプ"],
      feedbackType: record["どのような情報ですか？"],
      details: record["詳細について教えてください"],
      imageUrl: record["画像があればアプロードしてください"] || null,
      facilityId: record["【自動で入力されます。変更しないでください】施設ID"],
    }));
}
