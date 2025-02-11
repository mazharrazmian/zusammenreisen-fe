import { useState } from "react";
import { Button, Dialog } from "@mui/material";
import Chat from "./Chat";

const ChatButton = ({ userId, roomId, username }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Chat with {username}
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <Chat roomId={roomId} userId={userId} />
      </Dialog>
    </>
  );
};

export default ChatButton;
