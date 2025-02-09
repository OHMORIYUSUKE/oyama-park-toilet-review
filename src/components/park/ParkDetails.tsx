import { Park } from "@/types/park";
import { Box, Typography } from "@mui/material";

type ParkDetailsProps = {
  park: Park;
};

export function ParkDetails({ park }: ParkDetailsProps) {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="body2" color="text.secondary">
        住所: {park.address}
      </Typography>
    </Box>
  );
}
