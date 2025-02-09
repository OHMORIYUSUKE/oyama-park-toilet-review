export type Feedback = {
  timestamp: string;
  facilityType: "公園" | "トイレ";
  feedbackType: string;
  details: string;
  imageUrls: string[];
  facilityId: string;
};

export type FeedbackResponse = {
  status: string;
  records: {
    タイムスタンプ: string;
    "【自動で入力されます。変更しないでください】施設タイプ": "公園" | "トイレ";
    "どのような情報ですか？": string;
    詳細について教えてください: string;
    画像があればアプロードしてください: string;
    "【自動で入力されます。変更しないでください】施設ID": string;
  }[];
};
