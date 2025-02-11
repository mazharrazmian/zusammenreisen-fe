import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  TextField,
  Button,
  useMediaQuery,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import ScrollableFeed from "react-scrollable-feed";
import Navbar from "../components/navbar";
import { Add } from "@mui/icons-material";
import chatServices from "../redux/api/chatServices";
import { useDispatch, useSelector } from "react-redux";
import { getChatRooms } from "../redux/slice/chatSlice";
import noChat from "../assets/chat.svg";
import Iconify from "../components/iconify";
import { useNavigate } from "react-router-dom";
// Dummy data for chats and messages

const ChatPage: React.FC = () => {
  const userChats = useSelector((s) => s?.chat);
  const profile = useSelector((s) => s?.profile);
  const [activeChat, setActiveChat] = useState(userChats[0]);
  const [messageList, setMessageList] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sendingChat, setSendingChat] = useState(false);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"list" | "chat">("list"); // Added state for mobile view
  const [email, setEmail] = useState<string>("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (profile?.profile?.email) {
      dispatch(getChatRooms(profile?.profile?.email));
    }
  }, [profile?.profile?.email]);

  const handleSendMessage = async () => {
    if (newMessage.trim() !== "") {
      // Prepare the new message object to be added
      const newMessageObject = {
        content: newMessage,
        sender: {
          id: profile?.profile?.profile?.id, // Assuming this is the ID of the current user
        },
        timestamp: new Date().toISOString(), // Use the current timestamp
      };

      try {
        // Send the message to the server
        setSendingChat(true);
        const response = await chatServices.sendMessage({
          chat_room: activeChat?.id, // The current active chat room ID
          content: newMessage,
        });

        // If the message was sent successfully, update the message list
        if (response.status === 201) {
          setMessageList((prevMessages) => [...prevMessages, newMessageObject]);
          setSendingChat(false);
          console.log("Message sent successfully:", response);
        } else {
          setSendingChat(false);
          console.error("Error sending message:", response);
        }

        // Clear the input field after sending the message
        setNewMessage("");
      } catch (error) {
        setSendingChat(false);
        console.error("Error sending message:", error);
        // Optionally handle errors (e.g., show an error message)
      }
    }
  };

  const handleStartChat = async () => {
    const datas = {
      second_participant: email,
    };
    try {
      const res = await chatServices.createRoom(datas);
      console.log(res)
      if (res?.status === 201) {
        dispatch(getChatRooms(profile?.profile?.email));
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Box
        sx={{
          background: "#000",
          width: "100%",
          height: { md: "100px", xs: "90px" },
        }}
      >
        <Navbar position="static" />
      </Box>
      <Box
        sx={{
          height: { md: "85vh", xs: "89vh" },
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <Box
          display="flex"
          height="100%"
          bgcolor="#f5f5f5"
          sx={{
            padding: { xs: "0rem", md: "1rem" },
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          {/* Sidebar or Chat List */}
          {isMobile ? (
            view === "list" ? (
              <Box
                sx={{
                  width: "100%",
                  background: "#fff",
                  boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0rem 1rem",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {" "}
                    <IconButton
                      onClick={() => navigate("/")}
                      sx={{ color: "#637381" }}
                    >
                      <Iconify icon="material-symbols:arrow-back-rounded" />
                    </IconButton>
                    <Typography variant="h6" textAlign="center" padding={2}>
                      Chats
                    </Typography>
                  </Box>
                  <IconButton onClick={() => setOpen(true)}>
                    <Add />
                  </IconButton>
                </Box>
                <Divider />
                {userChats.loading === "fulfilled" ? (
                  <List>
                    {userChats?.data?.map((chat) => {
                      // Identify the participant who is not the sender (you)
                      const receiver = chat.participants.find(
                        (p) => p.profile?.id !== profile?.profile?.profile?.id
                      );

                      return (
                        <ListItem
                          key={chat?.id}
                          button
                          selected={activeChat?.id === chat?.id}
                          onClick={() => {
                            setActiveChat(chat);
                            setView("chat"); // Switch to chat view
                            setMessageList(chat.messages);
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar
                              src={receiver?.profile?.avatar || ""}
                              alt={receiver?.profile?.name || "User"}
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={receiver?.profile?.name || "Unknown User"}
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                ) : (
                  "loading..."
                )}
              </Box>
            ) : (
              // Chat Box for Mobile
              <Box
                flexGrow={1}
                display="flex"
                flexDirection="column"
                sx={{
                  border: "1px solid #ddd",
                  borderRadius: "16px",
                  overflow: "hidden",
                  paddingBottom: "1rem",
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    padding: 2,
                    background: "#fff",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    boxShadow: "0px -10px 10px rgba(0,0,0, 0.2)",
                  }}
                >
                  <Typography variant="h6" sx={{ color: "#000" }}>
                    {
                      activeChat?.participants?.find(
                        (p) => p.profile?.id !== profile?.profile?.profile?.id
                      )?.profile?.name
                    }
                  </Typography>
                </Box>

                <Box
                  flexGrow={1}
                  overflow="hidden"
                  padding={2}
                  display="flex"
                  flexDirection="column"
                  justifyContent="flex-end"
                  bgcolor="#f9f9f9"
                >
                  <ScrollableFeed>
                    {messageList?.map((msg, index) => {
                      const isSentByCurrentUser =
                        msg.sender?.id === profile?.profile?.profile?.id;

                      return (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            justifyContent: "flex-start",
                            marginBottom: 2,
                          }}
                        >
                          {/* Message Content */}
                          <Box
                            sx={{
                              maxWidth: "60%",
                              padding: 1.5,
                              color: "#000",
                            }}
                          >
                            {/* Sender and Timestamp */}
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: "10px",
                                marginBottom: 0.5,
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{ fontWeight: "bold", color: "#74767E" }}
                              >
                                {isSentByCurrentUser
                                  ? "me"
                                  : msg.sender?.profile?.name || "Unknown User"}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{ color: "rgba(0, 0, 0, 0.6)" }}
                              >
                                {new Date(msg?.timestamp).toLocaleDateString(
                                  [],
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "2-digit",
                                  }
                                )}{" "}
                                {new Date(msg?.timestamp).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </Typography>
                            </Box>

                            {/* Message Text */}
                            <Typography variant="body1">
                              {msg.content}
                            </Typography>
                          </Box>
                        </Box>
                      );
                    })}
                  </ScrollableFeed>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    padding: 2,
                    background: "#fff",
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                >
                  <TextField
                    variant="outlined"
                    placeholder="Type your message..."
                    fullWidth
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    sx={{ marginRight: 2 }}
                  />
                  <IconButton
                    color="primary"
                    onClick={handleSendMessage}
                    sx={{
                      borderRadius: "12px",
                      width: 50,
                      height: 50,
                      border: "1px solid",
                    }}
                  >
                    {sendingChat ? (
                      <CircularProgress size={24} />
                    ) : (
                      <SendIcon />
                    )}
                  </IconButton>
                </Box>
              </Box>
            )
          ) : (
            // Desktop Layout
            <>
              <Box
                sx={{
                  width: "25%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0rem 1rem",
                  }}
                >
                  <Typography variant="h6" textAlign="center" padding={2}>
                    Chats
                  </Typography>
                  <IconButton onClick={() => setOpen(true)}>
                    <Add />
                  </IconButton>
                </Box>
                <Divider />
                {userChats.loading === "fulfilled" ? (
                  <List>
                    {userChats?.data?.map((chat) => {
                      // Identify the participant who is not the sender (you)
                      const receiver = chat.participants.find(
                        (p) => p.profile?.id !== profile?.profile?.profile?.id
                      );

                      return (
                        <ListItem
                          key={chat?.id}
                          button
                          selected={activeChat?.id === chat?.id}
                          onClick={() => {
                            setActiveChat(chat);
                            setView("chat"); // Switch to chat view
                            setMessageList(chat.messages);
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar
                              src={receiver?.profile?.avatar || ""}
                              alt={receiver?.profile?.name || "User"}
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={receiver?.profile?.name || "Unknown User"}
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                ) : (
                  "loading..."
                )}
              </Box>
              {/* Chat Box */}
              {activeChat ? (
                <Box
                  flexGrow={1}
                  display="flex"
                  flexDirection="column"
                  sx={{
                    border: "1px solid #ddd",
                    borderRadius: "16px",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      padding: 2,
                      background: "#fff",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      boxShadow: "0px -10px 10px rgba(0,0,0, 0.2)",
                      minHeight: "70px",
                    }}
                  >
                    <Typography variant="h6" sx={{ color: "#000" }}>
                      {
                        activeChat?.participants?.find(
                          (p) => p.profile?.id !== profile?.profile?.profile?.id
                        )?.profile?.name
                      }
                    </Typography>
                  </Box>

                  <Box
                    flexGrow={1}
                    overflow="hidden"
                    padding={2}
                    display="flex"
                    flexDirection="column"
                    justifyContent="flex-end"
                    bgcolor="#f9f9f9"
                  >
                    <ScrollableFeed>
                      {messageList?.map((msg, index) => {
                        const isSentByCurrentUser =
                          msg.sender?.id === profile?.profile?.profile?.id;

                        return (
                          <Box
                            key={index}
                            sx={{
                              display: "flex",
                              justifyContent: "flex-start",
                              marginBottom: 2,
                            }}
                          >
                            {/* Message Content */}
                            <Box
                              sx={{
                                maxWidth: "60%",
                                padding: 1.5,
                                color: "#000",
                              }}
                            >
                              {/* Sender and Timestamp */}
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  gap: "10px",
                                  marginBottom: 0.5,
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  sx={{ fontWeight: "bold", color: "#74767E" }}
                                >
                                  {isSentByCurrentUser
                                    ? "me"
                                    : msg.sender?.profile?.name ||
                                      "Unknown User"}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{ color: "rgba(0, 0, 0, 0.6)" }}
                                >
                                  {new Date(msg?.timestamp).toLocaleDateString(
                                    [],
                                    {
                                      year: "numeric",
                                      month: "short",
                                      day: "2-digit",
                                    }
                                  )}{" "}
                                  {new Date(msg?.timestamp).toLocaleTimeString(
                                    [],
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </Typography>
                              </Box>

                              {/* Message Text */}
                              <Typography variant="body1">
                                {msg.content}
                              </Typography>
                            </Box>
                          </Box>
                        );
                      })}
                    </ScrollableFeed>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      padding: 2,
                      background: "#fff",
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  >
                    <TextField
                      variant="outlined"
                      placeholder="Type your message..."
                      fullWidth
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      sx={{ marginRight: 2 }}
                    />
                    <IconButton
                      color="primary"
                      onClick={handleSendMessage}
                      sx={{
                        borderRadius: "12px",
                        width: 50,
                        height: 50,
                        border: "1px solid",
                      }}
                    >
                      {sendingChat ? (
                        <CircularProgress size={24} />
                      ) : (
                        <SendIcon />
                      )}
                    </IconButton>
                  </Box>
                </Box>
              ) : (
                <Box
                  flexGrow={1}
                  display="flex"
                  flexDirection="column"
                  sx={{
                    border: "1px solid #ddd",
                    borderRadius: "16px",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  >
                    <img src={noChat} alt="" />
                    <Typography sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                      Pick up where you left off
                    </Typography>
                    <Typography>Select a conversation and chat away</Typography>
                  </Box>
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Start Chat</DialogTitle>
        <DialogContent sx={{ minWidth: "320px" }}>
          <Box sx={{ marginTop: "10px" }}>
            <TextField
              fullWidth
              label="Enter Email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Box>
          <DialogActions>
            <Button variant="outlined" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleStartChat}>
              Start Chat
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatPage;
