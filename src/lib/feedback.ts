import { FeedbackResponse } from "../types/feedback";

const FEEDBACK_API_URL =
  "https://script.google.com/macros/s/AKfycbzW1mNVDhmpHyYGad1AhIAH3wzC1kfXu95vH8UNIUzOAtk1PwhpXaMy5_LreHQUAmIdbQ/exec";

export async function getFeedbackData(): Promise<FeedbackResponse> {
  const response = await fetch(FEEDBACK_API_URL, {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch feedback data");
  }
  return response.json();
}
