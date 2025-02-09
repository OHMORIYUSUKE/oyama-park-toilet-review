import { Toilet } from "@/types/toilet";
import { AVAILABILITY_DISPLAY } from "@/constants/facilities";
import { Box, Typography } from "@mui/material";

/** トイレ詳細のプロパティ */
type ToiletDetailsProps = {
  /** トイレの情報 */
  toilet: Toilet;
};

/**
 * トイレの詳細情報を表示するコンポーネント
 */
export function ToiletDetails({ toilet }: ToiletDetailsProps) {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="body2" color="text.secondary">
        住所: {toilet.address}
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1">設備情報</Typography>
        <Typography variant="body2">
          車椅子対応: {AVAILABILITY_DISPLAY[toilet.wheelchair]}
        </Typography>
        <Typography variant="body2">
          乳幼児設備: {AVAILABILITY_DISPLAY[toilet.babyroom]}
        </Typography>
        <Typography variant="body2">
          オストメイト: {AVAILABILITY_DISPLAY[toilet.ostomy]}
        </Typography>
      </Box>
    </Box>
  );
}
