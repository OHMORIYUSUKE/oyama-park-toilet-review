import { IconButton, Snackbar } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import { useState } from "react";

/**
 * 現在のURLをクリップボードにコピーするボタンコンポーネント
 */
export function ShareButton() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  /**
   * シェアボタンクリック時の処理
   */
  const handleShare = async () => {
    const url = window.location.href;
    await navigator.clipboard.writeText(url);
    setSnackbarOpen(true);
  };

  return (
    <>
      <IconButton onClick={handleShare}>
        <ShareIcon />
      </IconButton>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="URLをコピーしました"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </>
  );
}
