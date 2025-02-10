import { Box, Typography } from "@mui/material";
import Image from "next/image";
import { Feedback } from "@/types/feedback";

interface FeedbackListProps {
  feedbacks: Feedback[];
  onImageClick: (url: string) => void;
}

export function FeedbackList({ feedbacks, onImageClick }: FeedbackListProps) {
  if (feedbacks.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
        情報提供
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {feedbacks.map((feedback, index) => (
          <Box
            key={index}
            sx={{
              p: 2,
              bgcolor: "rgba(0,0,0,0.02)",
              borderRadius: 2,
              border: "1px solid rgba(0,0,0,0.05)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                {feedback.feedbackType}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(feedback.timestamp).toLocaleString("ja-JP", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ mb: 3, fontSize: "large" }}>
              {feedback.details}
            </Typography>
            {feedback.imageUrls && feedback.imageUrls.length > 0 && (
              <Box
                sx={{
                  mt: 1,
                  display: "grid",
                  gap: 1,
                  gridTemplateColumns: "repeat(3, 1fr)",
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
                      style={{
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                      onClick={() => onImageClick(url)}
                    />
                  </div>
                ))}
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
