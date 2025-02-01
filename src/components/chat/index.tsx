// ChatDrawer.tsx
import React from "react";
import {
  Box,
  Drawer,
  Typography,
  IconButton,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface ChatDrawerProps {
  open: boolean;
  onClose: () => void;
}

const ChatDrawer: React.FC<ChatDrawerProps> = ({ open, onClose }) => {
  const [message, setMessage] = React.useState("");
  const [chatHistory, setChatHistory] = React.useState([
    { sender: "Support", text: "Hello! How can I assist you today?" },
    { sender: "User", text: "I have a question about my order." },
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      setChatHistory([...chatHistory, { sender: "User", text: message }]);
      setMessage("");
      // Simulate support response
      setTimeout(() => {
        setChatHistory((prev) => [
          ...prev,
          { sender: "Support", text: "Thank you for your message!" },
        ]);
      }, 1000);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: 300,
          padding: 2,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Chat</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Box sx={{ marginTop: 2, height: "100%", overflowY: "auto" }}>
        <List>
          {chatHistory.map((chat, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`${chat.sender}: ${chat.text}`}
                sx={{
                  textAlign: chat.sender === "User" ? "right" : "left",
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
      <Box sx={{ display: "flex", marginTop: 2, gap: "10px" }}>
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
            },
            "& .MuiOutlinedInput-input": {
              padding: "7px 14px",
            },
          }}
        />
        <Button variant="contained" color="primary" onClick={handleSendMessage}>
          Send
        </Button>
      </Box>
    </Drawer>
  );
};

export default ChatDrawer;
