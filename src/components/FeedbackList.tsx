"use client";

import { Feedback } from "../types/feedback";
import { Card, CardContent, Typography, Box, Modal } from "@mui/material";
import Image from "next/image";
import { useState } from "react";

type FeedbackListProps = {
  feedbacks: Feedback[];
};

export function FeedbackList({ feedbacks }: FeedbackListProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  return (
    <Box component="section" sx={{ width: "100%", maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h4" component="h2" gutterBottom>
        最新の情報 ({feedbacks.length}件)
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {feedbacks.map((feedback) => (
          <Card key={feedback.タイムスタンプ}>
            <CardContent>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="h6" component="h3">
                  {feedback["どのような情報ですか？"]}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(feedback.タイムスタンプ).toLocaleDateString(
                    "ja-JP"
                  )}
                </Typography>
              </Box>
              <Typography variant="body1">
                {feedback["詳細について教えてください"]}
              </Typography>
              {feedback["画像があればアプロードしてください"] && (
                <div
                  style={{
                    position: "relative",
                    height: "200px",
                    marginTop: "16px",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    handleImageClick(
                      feedback["画像があればアプロードしてください"]
                    )
                  }
                >
                  <Image
                    src={feedback["画像があればアプロードしてください"]}
                    alt="報告画像"
                    fill
                    style={{ objectFit: "cover", borderRadius: "4px" }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>

      <Modal
        open={!!selectedImage}
        onClose={handleCloseModal}
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
            boxShadow: 24,
            p: 1,
          }}
          onClick={handleCloseModal}
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
