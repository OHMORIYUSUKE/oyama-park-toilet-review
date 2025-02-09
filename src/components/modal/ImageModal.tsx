import { Modal, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";

type ImageModalProps = {
  imageUrl: string | null;
  onClose: () => void;
};

export function ImageModal({ imageUrl, onClose }: ImageModalProps) {
  return (
    <Modal
      open={!!imageUrl}
      onClose={onClose}
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
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            bgcolor: "rgba(0,0,0,0.1)",
            zIndex: 1,
            "&:hover": {
              bgcolor: "rgba(0,0,0,0.2)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
        {imageUrl && (
          <Image
            src={imageUrl}
            alt="拡大画像"
            fill
            style={{ objectFit: "contain" }}
          />
        )}
      </Box>
    </Modal>
  );
}
