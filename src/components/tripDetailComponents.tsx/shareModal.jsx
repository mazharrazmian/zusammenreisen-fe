import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Box,
  Typography,
  Snackbar,
  Alert
} from "@mui/material";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
  LinkedinShareButton,
  LinkedinIcon
} from "react-share";

const ShareModal = ({ open, onClose, url, title, description, image }) => {
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setShowCopySuccess(true);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setShowCopySuccess(true);
    }
  };

  const shareData = {
    url,
    title,
    summary: description?.slice(0, 150) || title,
    hashtag: "#Zusammenreisen"
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Share this Trip</DialogTitle>
        <DialogContent>
          <Box display="flex" gap={2} flexWrap="wrap" justifyContent="center" mb={3}>
            <FacebookShareButton 
              url={shareData.url} 
              quote={shareData.title}
              hashtag={shareData.hashtag}
            >
              <FacebookIcon size={50} round />
            </FacebookShareButton>

            <TwitterShareButton 
              url={shareData.url} 
              title={shareData.title}
              hashtags={["Zusammenreisen", "Travel"]}
            >
              <TwitterIcon size={50} round />
            </TwitterShareButton>

            <WhatsappShareButton 
              url={shareData.url} 
              title={shareData.title}
              separator=" - "
            >
              <WhatsappIcon size={50} round />
            </WhatsappShareButton>

            <LinkedinShareButton
              url={shareData.url}
              title={shareData.title}
              summary={shareData.summary}
            >
              <LinkedinIcon size={50} round />
            </LinkedinShareButton>
          </Box>

          <Box mb={2}>
            <Button 
              variant="outlined" 
              onClick={handleCopyLink}
              fullWidth
              sx={{ mb: 1 }}
            >
              Copy Link
            </Button>
          </Box>

          <Typography variant="body2" color="text.secondary" textAlign="center">
            <strong>Note:</strong> Instagram and TikTok don't support direct sharing. 
            Copy the link and paste it manually in your bio or story.
          </Typography>

          {/* Preview of what will be shared */}
          <Box 
            sx={{ 
              mt: 2, 
              p: 2, 
              border: '1px solid #e0e0e0', 
              borderRadius: 1,
              backgroundColor: '#f9f9f9'
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Link Preview:
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {title}
            </Typography>
            {description && (
              <Typography variant="body2" color="text.secondary">
                {description.slice(0, 100)}...
              </Typography>
            )}
            <Typography variant="caption" color="primary">
              {url}
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={showCopySuccess}
        autoHideDuration={3000}
        onClose={() => setShowCopySuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setShowCopySuccess(false)}>
          Link copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
};

export default ShareModal;