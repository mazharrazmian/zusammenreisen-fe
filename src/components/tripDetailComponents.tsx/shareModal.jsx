import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Box,
  Typography
} from "@mui/material";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon
} from "react-share";

const ShareModal = ({ open, onClose, url, title }) => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Share this Trip</DialogTitle>
      <DialogContent>
        <Box display="flex" gap={2} flexWrap="wrap" justifyContent="center" mb={2}>
          <FacebookShareButton url={url} quote={title}>
            <FacebookIcon size={40} round />
          </FacebookShareButton>

          <TwitterShareButton url={url} title={title}>
            <TwitterIcon size={40} round />
          </TwitterShareButton>

          <WhatsappShareButton url={url} title={title}>
            <WhatsappIcon size={40} round />
          </WhatsappShareButton>

          <Button variant="outlined" onClick={handleCopyLink}>
            Copy Link
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary">
          Instagram and TikTok don’t support direct sharing. Paste the link manually in your bio or story.
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
