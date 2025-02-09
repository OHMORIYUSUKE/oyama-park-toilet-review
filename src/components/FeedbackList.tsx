import { Card, CardContent, Typography, Box, Modal } from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import { Feedback } from "@/types/feedback";

/** フィードバックリストのプロパティ */
type FeedbackListProps = {
  /** フィードバックデータの配列 */
  feedbacks: Feedback[];
};

/**
 * 施設に対するフィードバックを一覧表示するコンポーネント
 */
export function FeedbackList({ feedbacks }: FeedbackListProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        情報提供 ({feedbacks.length}件)
      </Typography>
      {feedbacks.map((feedback, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="caption" color="text.secondary">
              {new Date(feedback.timestamp).toLocaleString("ja-JP", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Typography>
            <Typography variant="subtitle1">{feedback.feedbackType}</Typography>
            <Typography variant="body2">{feedback.details}</Typography>
            {feedback.imageUrls && feedback.imageUrls.length > 0 && (
              <Box
                sx={{
                  mt: 1,
                  display: "grid",
                  gap: 1,
                  gridTemplateColumns:
                    feedback.imageUrls.length === 1
                      ? "1fr"
                      : "repeat(auto-fit, minmax(120px, 1fr))",
                  "& > div": {
                    aspectRatio: "1",
                    position: "relative",
                    borderRadius: 2,
                    overflow: "hidden",
                  },
                }}
              >
                {feedback.imageUrls.map((url, i) => (
                  <div key={i}>
                    <Image
                      src={url}
                      alt={`フィードバック画像 ${i + 1}`}
                      fill
                      style={{ objectFit: "cover", cursor: "pointer" }}
                      onClick={() => setSelectedImage(url)}
                    />
                  </div>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
      ))}
      <Modal
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "90vw",
            height: "90vh",
            bgcolor: "background.paper",
            p: 1,
            borderRadius: 1,
          }}
        >
          {selectedImage && (
            <Image
              src={selectedImage}
              alt="拡大画像"
              fill
              style={{ objectFit: "contain" }}
            />
          )}
        </Box>
      </Modal>
    </Box>
  );
}
