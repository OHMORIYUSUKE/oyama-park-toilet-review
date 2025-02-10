/**
 * アプリケーション全体の設定
 */
export const APP_CONFIG = {
  /** GitHubリポジトリのURL */
  GITHUB_URL: "https://github.com/OHMORIYUSUKE/oyama-park-toilet-review",
  /** フィードバックフォームの設定 */
  FEEDBACK_FORM: {
    /** フィードバックフォームのベースURL */
    BASE_URL:
      "https://docs.google.com/forms/d/e/1FAIpQLSfAM_EddPsoFw4jmLZ9RQ9SKOWbWNnLdpIABZCh6FiTXJRsQw/viewform",
    /** フォームのパラメータ定義 */
    PARAMS: {
      /** 施設種別を指定するパラメータ名 */
      FACILITY_TYPE: "entry.1276758939",
      /** 施設IDを指定するパラメータ名 */
      FACILITY_ID: "entry.653877169",
    },
  },
} as const;

/**
 * フィードバックフォームのURLを生成する
 * @param type - 施設の種類（"park" または "toilet"）
 * @param id - 施設のID
 * @returns フィードバックフォームの完全なURL
 */
export const createFeedbackUrl = (
  type: "park" | "toilet",
  id: string
): string => {
  const params = new URLSearchParams({
    usp: "pp_url",
    [APP_CONFIG.FEEDBACK_FORM.PARAMS.FACILITY_TYPE]:
      type === "park" ? "公園" : "トイレ",
    [APP_CONFIG.FEEDBACK_FORM.PARAMS.FACILITY_ID]: id,
  });
  return `${APP_CONFIG.FEEDBACK_FORM.BASE_URL}?${params.toString()}`;
};
