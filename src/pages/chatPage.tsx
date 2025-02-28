
  
  interface ProfileState {
    profile: Profile;
  }
  
  interface RootState {
    chat: UserChats;
    profile: ProfileState;
  }
  //Step 2: Update the Component with Types
  //Now, let's update the component to use these types.
  
  //typescript
  //Copy
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
  } from "@mui/material";
  import SendIcon from "@mui/icons-material/Send";
  import { useTheme } from "@mui/material/styles";
  import ScrollableFeed from "react-scrollable-feed";
  import Navbar from "../components/navbar";
  import { Add } from "@mui/icons-material";
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
    const [userChats,setUserChats] = useState<UserChats>({loading:'loading',data:[]})
    const [activeChat, setActiveChat] = useState<ChatRoom | null>(null);
    const [messageList, setMessageList] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>("");
    const [sendingChat, setSendingChat] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [view, setView] = useState<"list" | "chat">("list");
    const [email, setEmail] = useState<string>("");
  
    const token = Cookies.get('accessToken');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const navigate = useNavigate();
    
    useEffect(() => {
    chatServices.getChatRoomsCurrUser()
    .then(response=>{
        setUserChats({loading:'fulfilled',data:response.data})
    })
    .catch(error=>{
        toast('couldnt get chats for you')
    })
      
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
  
        console.log(CHAT_URL)
        ws.current = new WebSocket(`${CHAT_URL}/ws/chat/${chatId}/?token=${token}`);

        ws.current.onopen = () => console.log("WebSocket opened");
        ws.current.onmessage = (event) => {
            console.log('new message')
          const data = JSON.parse(event.data);
          if (data.type === "chat_message") {
            setMessageList((prevMessages) => [...prevMessages, data.message]);
          }
        };
        ws.current.onclose = () => console.log("WebSocket disconnected");
  
        return () => {
          if (ws.current) {
            console.log(ws.current.readyState);

            if (ws.current.readyState === 1) { // <-- This is important
                ws.current.close();
            }
          }
        };
      }
    }, [activeChat, token]);
  
    const handleSendSocketMessage = () => {
        if (newMessage.trim() && ws.current) {
          const messageData = {
            content: newMessage,
            chat_room: activeChat?.id,
            type: 'send_message',
          };
      
          ws.current.send(JSON.stringify(messageData));
      
          // **Do not add message directly to state, wait for WebSocket response**
          setNewMessage("");
        }
      };
  
    const handleStartChat = async () => {
      const datas = {
        second_participant: email,
      };
      try {
        const res = await chatServices.createRoom(datas);
        if (res?.status === 201) {
          chatServices.getChatRooms(profile.profile.email)
          .then(response=>{
            setUserChats({'loading':'fulfilled',data:response.data})
          })
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
        <Navbar />
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
                                  : msg.sender?.name || "Unknown User"}
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
