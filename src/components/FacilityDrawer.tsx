import { Drawer, IconButton, Typography, Box, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ShareIcon from "@mui/icons-material/Share";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FeedbackIcon from "@mui/icons-material/Feedback";
import { ToiletDetails } from "./ToiletDetails";
import { FeedbackList } from "./FeedbackList";
import { Park } from "@/types/park";
import { Toilet } from "@/types/toilet";
import { Feedback } from "@/types/feedback";

type SelectedFacility =
  | {
      type: "park";
      data: Park;
    }
  | {
      type: "toilet";
      data: Toilet;
    };

interface FacilityDrawerProps {
  open: boolean;
  selectedFacility: SelectedFacility | null;
  onClose: () => void;
  feedbacks: Feedback[];
  onCopyInfo: () => void;
  onImageClick: (url: string) => void;
}

export function FacilityDrawer({
  open,
  selectedFacility,
  onClose,
  feedbacks,
  onCopyInfo,
  onImageClick,
}: FacilityDrawerProps) {
  const getFacilityFeedbacks = (facilityId: string) => {
    return feedbacks
      .filter((feedback) => feedback.facilityId === facilityId)
      .sort((a, b) => {
        return (
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      });
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: {
            xs: "100%",
            sm: "600px",
            md: "700px",
          },
          boxSizing: "border-box",
        },
      }}
    >
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            p: 3,
            pb: 0,
            position: "relative",
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              bgcolor: "rgba(0,0,0,0.05)",
              "&:hover": {
                bgcolor: "rgba(0,0,0,0.1)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 3,
            pt: 0,
          }}
        >
          {selectedFacility && (
            <>
              <Typography
                variant="h5"
                sx={{
                  mt: 3,
                  fontWeight: "bold",
                  borderBottom: "2px solid #2196f3",
                  pb: 1,
                }}
              >
                {selectedFacility.data.name}
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <LocationOnIcon sx={{ fontSize: 20 }} />
                {selectedFacility.data.address}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mt: 2,
                  mb: 3,
                }}
              >
                <Button
                  variant="outlined"
                  size="medium"
                  startIcon={<ShareIcon />}
                  onClick={onCopyInfo}
                >
                  この施設の情報をコピー
                </Button>
              </Box>

              {selectedFacility.type === "toilet" && (
                <ToiletDetails toilet={selectedFacility.data} />
              )}

              <FeedbackList
                feedbacks={getFacilityFeedbacks(selectedFacility.data.id)}
                onImageClick={onImageClick}
              />
            </>
          )}
        </Box>

        <Box
          sx={{
            p: 3,
            pt: 2,
            borderTop: "1px solid rgba(0,0,0,0.05)",
            bgcolor: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(5px)",
          }}
        >
          <Button
            variant="contained"
            fullWidth
            startIcon={<FeedbackIcon />}
            href={`https://docs.google.com/forms/d/e/1FAIpQLSfAM_EddPsoFw4jmLZ9RQ9SKOWbWNnLdpIABZCh6FiTXJRsQw/viewform?usp=pp_url&entry.1276758939=${
              selectedFacility?.type === "park" ? "公園" : "トイレ"
            }&entry.653877169=${selectedFacility?.data.id}`}
            target="_blank"
            sx={{
              bgcolor: "#2196f3",
              "&:hover": {
                bgcolor: "#1976d2",
              },
            }}
          >
            この施設の情報を提供する
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
