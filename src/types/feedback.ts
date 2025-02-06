export type Feedback = {
  タイムスタンプ: string;
  "【自動で入力されます。変更しないでください】施設タイプ_ID": string;
  "どのような情報ですか？": string;
  詳細について教えてください: string;
  画像があればアプロードしてください: string;
};

export type FeedbackResponse = {
  status: string;
  records: Feedback[];
};
