import { Box, Typography } from "@mui/material";
import WcIcon from "@mui/icons-material/Wc";
import AccessibleIcon from "@mui/icons-material/Accessible";
import { Toilet } from "@/types/toilet";

interface ToiletDetailsProps {
  toilet: Toilet;
}

interface ToiletInfoBoxProps {
  label: string;
  value: string | number;
  color?: string;
}

function ToiletInfoBox({ label, value, color }: ToiletInfoBoxProps) {
  return (
    <Box
      sx={{
        p: 1.5,
        bgcolor: "white",
        borderRadius: 1,
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        textAlign: "center",
      }}
    >
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", color: color || "text.primary" }}
      >
        {value}
      </Typography>
    </Box>
  );
}

export function ToiletDetails({ toilet }: ToiletDetailsProps) {
  return (
    <Box
      sx={{
        mt: 2,
        p: 2,
        bgcolor: "rgba(0,0,0,0.02)",
        borderRadius: 2,
        border: "1px solid rgba(0,0,0,0.05)",
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
        トイレ情報
      </Typography>
      <Box>
        {/* 男性トイレ情報 */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="subtitle1"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "primary.main",
              fontWeight: "bold",
            }}
          >
            <WcIcon /> 男性トイレ
          </Typography>
          <Box
            sx={{
              ml: 3,
              mt: 1,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              gap: 1,
            }}
          >
            <ToiletInfoBox
              label="総数"
              value={toilet.menTotal}
              color="primary.main"
            />
            <ToiletInfoBox
              label="小便器"
              value={toilet.menUrinal}
              color="primary.main"
            />
            <ToiletInfoBox
              label="和式"
              value={toilet.menJapanese}
              color="primary.main"
            />
            <ToiletInfoBox
              label="洋式"
              value={toilet.menWestern}
              color="primary.main"
            />
          </Box>
        </Box>

        {/* 女性トイレ情報 */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="subtitle1"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "#e91e63",
              fontWeight: "bold",
            }}
          >
            <WcIcon /> 女性トイレ
          </Typography>
          <Box
            sx={{
              ml: 3,
              mt: 1,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              gap: 1,
            }}
          >
            <ToiletInfoBox
              label="総数"
              value={toilet.womenTotal}
              color="#e91e63"
            />
            <ToiletInfoBox
              label="和式"
              value={toilet.womenJapanese}
              color="#e91e63"
            />
            <ToiletInfoBox
              label="洋式"
              value={toilet.womenWestern}
              color="#e91e63"
            />
          </Box>
        </Box>

        {/* 設備情報 */}
        <Box>
          <Typography
            variant="subtitle1"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "text.primary",
              fontWeight: "bold",
            }}
          >
            <AccessibleIcon /> バリアフリー設備
          </Typography>
          <Box
            sx={{
              ml: 3,
              mt: 1,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              gap: 1,
            }}
          >
            <ToiletInfoBox label="多機能" value={`${toilet.multifunction}個`} />
            <ToiletInfoBox
              label="車椅子"
              value={toilet.wheelchair === "有" ? "⭕️" : "❌"}
            />
            <ToiletInfoBox
              label="乳幼児"
              value={toilet.babyroom === "有" ? "⭕️" : "❌"}
            />
            <ToiletInfoBox
              label="オストメイト"
              value={toilet.ostomy === "有" ? "⭕️" : "❌"}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
