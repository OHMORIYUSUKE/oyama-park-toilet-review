import { Drawer, Box, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ParkDetails } from "../park/ParkDetails";
import { ToiletDetails } from "../toilet/ToiletDetails";
import { FeedbackList } from "../FeedbackList";
import { ShareButton } from "../ShareButton";
import { SelectedFacility } from "@/types/map";
import { Feedback } from "@/types/feedback";

type FacilityDrawerProps = {
  open: boolean;
  facility: SelectedFacility | null;
  feedbacks: Feedback[];
  onClose: () => void;
};

export function FacilityDrawer({
  open,
  facility,
  feedbacks,
  onClose,
}: FacilityDrawerProps) {
  if (!facility) return null;

  const facilityFeedbacks = feedbacks.filter(
    (feedback) => feedback.facilityId === facility.data.id
  );

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
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h5">{facility.data.name}</Typography>
          <Box>
            <ShareButton />
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
        {facility.type === "park" ? (
          <ParkDetails park={facility.data} />
        ) : (
          <ToiletDetails toilet={facility.data} />
        )}
        <FeedbackList feedbacks={facilityFeedbacks} />
      </Box>
    </Drawer>
  );
}
