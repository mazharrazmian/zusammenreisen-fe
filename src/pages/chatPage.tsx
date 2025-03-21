import React, { useEffect, useRef, useState } from "react";
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
  Paper,
  Badge,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useTheme } from "@mui/material/styles";
import ScrollableFeed from "react-scrollable-feed";
import Navbar from "../components/navbar";
import { Add, ArrowBack } from "@mui/icons-material";
import chatServices from "../redux/api/chatServices";
import noChat from "../assets/chat.svg";
import Iconify from "../components/iconify";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { ChatRoom, Message, Profile, UserChats } from "../types";
import { useAppSelector } from "../redux/store";
import { CHAT_URL } from "../redux/api/http-common";

const ChatPage: React.FC = () => {
  const profile = useAppSelector((s) => s.profile);
  const ws = useRef<WebSocket | null>(null);
  const { chatId } = useParams<{ chatId: string }>();
  const [userChats, setUserChats] = useState<UserChats>({ loading: 'loading', data: [] });
  const [activeChat, setActiveChat] = useState<ChatRoom | null>(null);
  const [messageList, setMessageList] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [sendingChat, setSendingChat] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [view, setView] = useState<"list" | "chat">("list");
  const [email, setEmail] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const token = Cookies.get('accessToken');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  useEffect(() => {
    chatServices.getChatRoomsCurrUser()
      .then(response => {
        setUserChats({ loading: 'fulfilled', data: response.data });
      })
      .catch(error => {
        toast('Couldnt get chats for you');
      });
  }, []);

  useEffect(() => {
    if (activeChat) {
      navigate(`/chat/${activeChat.id}`, { replace: true });
    }
  }, [activeChat, navigate]);

  useEffect(() => {
    if (chatId && userChats?.data?.length > 0) {
      chatServices.retrieveRoom(Number(chatId))
        .then(response => {
          setActiveChat(response.data);
          setMessageList(response.data.messages);
        })
        .catch(error => {
          console.log(error);
          toast('Could not load chats.....');
        });
    }
  }, [chatId, userChats]);

  useEffect(() => {
    if (activeChat) {
      const chatId = activeChat.id;

      // Close existing WebSocket before creating a new one
      if (ws.current) {
        ws.current.close();
      }

      ws.current = new WebSocket(`${CHAT_URL}/ws/chat/${chatId}/?token=${token}`);

      ws.current.onopen = () => console.log("WebSocket opened");
      ws.current.onmessage = (event) => {
        console.log('new message');
        const data = JSON.parse(event.data);
        if (data.type === "chat_message") {
          setMessageList((prevMessages) => [...prevMessages, data.message]);
        }
      };
      ws.current.onclose = () => console.log("WebSocket disconnected");

      return () => {
        if (ws.current) {
          console.log(ws.current.readyState);

          if (ws.current.readyState === 1) {
            ws.current.close();
          }
        }
      };
    }
  }, [activeChat, token]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messageList]);

  const handleSendSocketMessage = () => {
    if (newMessage.trim() && ws.current) {
      const messageData = {
        content: newMessage,
        chat_room: activeChat?.id,
        type: 'send_message',
      };

      ws.current.send(JSON.stringify(messageData));
      setNewMessage("");
      
      // Focus back on input after sending
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleStartChat = async () => {
    const datas = {
      second_participant: email,
    };
    setSendingChat(true);
    try {
      const res = await chatServices.createRoom(datas);
      if (res?.status === 201) {
        chatServices.getChatRooms(profile.profile.email)
          .then(response => {
            setUserChats({ 'loading': 'fulfilled', data: response.data });
            // Automatically navigate to the new chat
            const newChatId = response.data[response.data.length - 1]?.id;
            if (newChatId && isMobile) {
              setActiveChat(response.data[response.data.length - 1]);
              setView("chat");
            }
          });
        setOpen(false);
        setEmail("");
      }
    } catch (error) {
      console.log(error);
      toast('Failed to create chat room');
    } finally {
      setSendingChat(false);
    }
  };

  // Get the most recent message for preview
  const getLastMessage = (chat: ChatRoom) => {
    if (chat.messages && chat.messages.length > 0) {
      const lastMsg = chat.messages[chat.messages.length - 1];
      return lastMsg.content.length > 25 ? lastMsg.content.substring(0, 25) + '...' : lastMsg.content;
    }
    return "No messages yet";
  };

  // Format timestamp for message preview
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <>
      <Box
        sx={{
          height: { md: "85vh", xs: "100vh" },
          borderRadius: { md: "12px", xs: "0" },
          overflow: "hidden",
        }}
      >
        <Box
          display="flex"
          height="100%"
          bgcolor="#f5f5f5"
          sx={{
            padding: { xs: "0", md: "1rem" },
            borderRadius: { md: "12px", xs: "0" },
            overflow: "hidden",
          }}
        >
          {/* Sidebar or Chat List for Mobile */}
          {isMobile ? (
            view === "list" ? (
              <Box
                sx={{
                  width: "100%",
                  background: "#fff",
                  boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.5rem 1rem",
                    borderBottom: "1px solid #eaeaea",
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    backgroundColor: "#fff",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <IconButton
                      onClick={() => navigate("/")}
                      sx={{ color: "#637381" }}
                    >
                      <Iconify icon="material-symbols:arrow-back-rounded" />
                    </IconButton>
                    <Typography variant="h6">Chats</Typography>
                  </Box>
                  <IconButton 
                    onClick={() => setOpen(true)}
                    sx={{ 
                      backgroundColor: theme.palette.primary.main,
                      color: "#fff",
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                      }
                    }}
                  >
                    <Add />
                  </IconButton>
                </Box>
                
                {userChats.loading === "fulfilled" ? (
                  userChats.data.length > 0 ? (
                    <List sx={{ overflow: "auto", flexGrow: 1, pb: 2 }}>
                      {userChats?.data?.map((chat) => {
                        const receiver = chat.participants.find(
                          (p) => p.profile?.id !== profile?.profile?.profile?.id
                        );
                        const lastMsg = chat.messages && chat.messages.length > 0 ? 
                          chat.messages[chat.messages.length-1] : null;

                        return (
                          <ListItem
                            key={chat?.id}
                            button
                            selected={activeChat?.id === chat?.id}
                            onClick={() => {
                              setActiveChat(chat);
                              setView("chat");
                              setMessageList(chat.messages);
                            }}
                            sx={{
                              borderBottom: "1px solid #f0f0f0",
                              '&.Mui-selected': {
                                backgroundColor: '#f0f7ff'
                              }
                            }}
                          >
                            <ListItemAvatar>
                              <Avatar
                                src={receiver?.profile?.avatar || ""}
                                alt={receiver?.profile?.name || "User"}
                                sx={{ width: 48, height: 48 }}
                              />
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    {receiver?.profile?.name || "Unknown User"}
                                  </Typography>
                                  {lastMsg && (
                                    <Typography variant="caption" color="text.secondary">
                                      {formatMessageTime(lastMsg.timestamp)}
                                    </Typography>
                                  )}
                                </Box>
                              }
                              secondary={
                                <Typography 
                                  variant="body2" 
                                  color="text.secondary"
                                  noWrap
                                  sx={{ maxWidth: "200px" }}
                                >
                                  {getLastMessage(chat)}
                                </Typography>
                              }
                            />
                          </ListItem>
                        );
                      })}
                    </List>
                  ) : (
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
                      <img src={noChat} alt="No Chats" style={{ width: "60%", maxWidth: "200px", marginBottom: "1rem" }} />
                      <Typography sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                        No conversations yet
                      </Typography>
                      <Typography sx={{ color: "text.secondary", textAlign: "center", maxWidth: "80%" }}>
                        Start a new chat by clicking the plus button
                      </Typography>
                    </Box>
                  )
                ) : (
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80%" }}>
                    <CircularProgress />
                  </Box>
                )}
              </Box>
            ) : (
              // Chat Box for Mobile
              <Box
                flexGrow={1}
                display="flex"
                flexDirection="column"
                sx={{
                  height: "100%",
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    padding: "0.75rem 1rem",
                    background: "#fff",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    boxShadow: "0px 1px 4px rgba(0,0,0, 0.1)",
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                  }}
                >
                  <IconButton 
                    onClick={() => setView("list")}
                    sx={{ color: "#637381" }}
                  >
                    <ArrowBack />
                  </IconButton>
                  <Avatar 
                    src={activeChat?.participants?.find(
                      (p) => p.profile?.id !== profile?.profile?.profile?.id
                    )?.profile?.avatar || ""}
                    sx={{ width: 36, height: 36 }}
                  />
                  <Typography fontWeight="medium">
                    {
                      activeChat?.participants?.find(
                        (p) => p.profile?.id !== profile?.profile?.profile?.id
                      )?.profile?.name || "Chat"
                    }
                  </Typography>
                </Box>

                <Box
                  flexGrow={1}
                  overflow="auto"
                  ref={scrollRef}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#f7f9fc",
                    padding: "1rem",
                    position: "relative",
                  }}
                >
                  {messageList && messageList.length > 0 ? (
                    messageList.map((msg, index) => {
                      const isSentByCurrentUser =
                        msg.sender?.id === profile?.profile?.profile?.id;
                      const showDate = index === 0 || (
                        new Date(msg.timestamp).toDateString() !== 
                        new Date(messageList[index-1].timestamp).toDateString()
                      );

                      return (
                        <React.Fragment key={index}>
                          {showDate && (
                            <Box sx={{ 
                              display: "flex", 
                              justifyContent: "center", 
                              my: 2 
                            }}>
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  bgcolor: "rgba(0,0,0,0.05)", 
                                  px: 2, 
                                  py: 0.5, 
                                  borderRadius: 10,
                                  color: "text.secondary"
                                }}
                              >
                                {new Date(msg.timestamp).toLocaleDateString([], {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </Typography>
                            </Box>
                          )}
                          
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: isSentByCurrentUser ? "flex-end" : "flex-start",
                              mb: 1.5,
                              maxWidth: "100%",
                            }}
                          >
                            <Box
                              sx={{
                                maxWidth: "80%",
                                position: "relative",
                              }}
                            >
                              {!isSentByCurrentUser && (
                                <Typography
                                  variant="caption"
                                  sx={{ 
                                    ml: 1.5, 
                                    mb: 0.5, 
                                    display: "block",
                                    color: "text.secondary",
                                    fontWeight: "medium"
                                  }}
                                >
                                  {msg.sender?.name || "Unknown User"}
                                </Typography>
                              )}
                              
                              <Paper
                                elevation={0}
                                sx={{
                                  p: 1.5,
                                  bgcolor: isSentByCurrentUser ? theme.palette.primary.main : "#fff",
                                  color: isSentByCurrentUser ? "#fff" : "text.primary",
                                  borderRadius: isSentByCurrentUser 
                                    ? "18px 18px 4px 18px"
                                    : "18px 18px 18px 4px",
                                  boxShadow: "0px 1px 2px rgba(0,0,0,0.08)",
                                  wordBreak: "break-word",
                                }}
                              >
                                <Typography variant="body1">
                                  {msg.content}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{ 
                                    display: "block", 
                                    textAlign: "right",
                                    mt: 0.5,
                                    opacity: 0.8
                                  }}
                                >
                                  {new Date(msg?.timestamp).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </Typography>
                              </Paper>
                            </Box>
                          </Box>
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <Box sx={{ 
                      display: "flex", 
                      flexDirection: "column", 
                      alignItems: "center", 
                      justifyContent: "center", 
                      height: "100%",
                      opacity: 0.7 
                    }}>
                      <Typography textAlign="center" color="text.secondary">
                        No messages yet. Start the conversation!
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    p: 1.5,
                    background: "#fff",
                    borderTop: "1px solid #eaeaea",
                    position: "sticky",
                    bottom: 0,
                    zIndex: 10,
                  }}
                >
                  <TextField
                    variant="outlined"
                    placeholder="Type your message..."
                    fullWidth
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    inputRef={inputRef}
                    sx={{
                      mr: 1,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "24px",
                        backgroundColor: "#f5f5f5",
                        "& fieldset": {
                          borderColor: "transparent",
                        },
                        "&:hover fieldset": {
                          borderColor: "transparent",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: theme.palette.primary.main,
                        },
                      },
                    }}
                    inputProps={{
                      sx: { p: 1.2 }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendSocketMessage();
                      }
                    }}
                  />
                  <IconButton
                    color="primary"
                    onClick={handleSendSocketMessage}
                    disabled={!newMessage.trim() || sendingChat}
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: "#fff",
                      width: 45,
                      height: 45,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                      },
                      '&.Mui-disabled': {
                        backgroundColor: "#e0e0e0",
                        color: "#9e9e9e",
                      }
                    }}
                  >
                    {sendingChat ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <SendIcon />
                    )}
                  </IconButton>
                </Box>
              </Box>
            )
          ) : (
            // Desktop Layout - Kept the same
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
                                    : msg.sender?.name ||
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
                        handleSendSocketMessage();
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
                      onClick={handleSendSocketMessage}
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
      <Dialog 
        open={open} 
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Start New Chat</DialogTitle>
        <DialogContent sx={{ pb: 1 }}>
          <TextField
            fullWidth
            label="Enter Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            variant="outlined"
            type="email"
            placeholder="example@email.com"
            autoFocus
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button variant="outlined" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleStartChat}
            disabled={!email.trim() || sendingChat}
            startIcon={sendingChat ? <CircularProgress size={18} color="inherit" /> : null}
          >
            {sendingChat ? "Creating..." : "Start Chat"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ChatPage;