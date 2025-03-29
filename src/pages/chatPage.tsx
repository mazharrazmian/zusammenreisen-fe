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
import MobileChat from "../components/chat/chatMobilePage";

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
    const [email, setEmail] = useState<string>("");
    const inputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

    const token = Cookies.get('accessToken');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const navigate = useNavigate();

    // Load user chats once on component mount
    useEffect(() => {
        const loadUserChats = async () => {
            try {
                const response = await chatServices.getChatRoomsCurrUser();
                setUserChats({ loading: 'fulfilled', data: response.data });

                // After loading chats, handle initial chat selection based on URL
                if (chatId && response.data.length > 0) {
                    try {
                        const chatResponse = await chatServices.retrieveRoom(Number(chatId));
                        setActiveChat(chatResponse.data);
                        setMessageList(chatResponse.data.messages);

                        // Mark messages as read
                        await chatServices.markMessagesAsRead(Number(chatId));
                        setUserChats(prevState => ({
                            ...prevState,
                            data: prevState.data.map(chat =>
                                chat.id === Number(chatId)
                                    ? { ...chat, unread_count: 0 }
                                    : chat
                            ),
                        }));
                    } catch (error) {
                        console.log(error);
                        toast('Could not load chat room');
                    }
                }
                setIsInitialLoad(false);
            } catch (error) {
                toast('Couldn\'t get chats for you');
                setIsInitialLoad(false);
            }
        };

        loadUserChats();
    }, []);

    // Handle chat selection from sidebar
    const handleChatSelection = async (chat: ChatRoom) => {
        // If we're already on this chat, don't do anything
        if (activeChat?.id === chat.id) return;

        // Update the URL without triggering the useEffect
        navigate(`/chat/${chat.id}`, { replace: true });

        // Set the active chat and message list
        setActiveChat(chat);
        setMessageList(chat.messages);
        if (chat.unread_count > 0) {
            // Mark messages as read
            try {
                await chatServices.markMessagesAsRead(chat.id);
                setUserChats(prevState => ({
                    ...prevState,
                    data: prevState.data.map(c =>
                        c.id === chat.id ? { ...c, unread_count: 0 } : c
                    ),
                }));
            } catch (error) {
                console.log(error);
            }
        }

    };

    // Handle URL changes (e.g., from notifications) after initial load
    useEffect(() => {
        if (isInitialLoad || !chatId) return;
        const loadChatFromUrl = async () => {
            try {
                const response = await chatServices.retrieveRoom(Number(chatId));
                console.log(response)
                setActiveChat(response.data);
                setMessageList(response.data.messages);

                // Mark messages as read
                await chatServices.markMessagesAsRead(Number(chatId));
                setUserChats(prevState => ({
                    ...prevState,
                    data: prevState.data.map(chat =>
                        chat.id === Number(chatId)
                            ? { ...chat, unread_count: 0 }
                            : chat
                    ),
                }));
            } catch (error) {
                console.log(error);
                toast('Could not load chat room');
            }
        };

        loadChatFromUrl();
    }, [chatId, isInitialLoad]);

    // WebSocket connection management
    useEffect(() => {
        if (!activeChat) return;

        const chatId = activeChat.id;

        // Close existing WebSocket before creating a new one
        if (ws.current) {
            ws.current.close();
        }

        ws.current = new WebSocket(`${CHAT_URL}/ws/chat/${chatId}/?token=${token}`);

        ws.current.onopen = () => console.log("WebSocket opened");
        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "chat_message") {
                setMessageList((prevMessages) => [...prevMessages, data.message]);
            }
        };
        ws.current.onclose = () => console.log("WebSocket disconnected");

        return () => {
            if (ws.current && ws.current.readyState === 1) {
                ws.current.close();
            }
        };
    }, [activeChat, token]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messageList]);

    const handleSendSocketMessage = () => {
        if (newMessage.trim() && ws.current && activeChat) {
            const messageData = {
                content: newMessage,
                chat_room: activeChat.id,
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
        if (!email.trim()) return;

        setSendingChat(true);
        try {
            const res = await chatServices.createRoom({ second_participant: email });
            if (res?.status === 201) {
                // Reload chat list
                const response = await chatServices.getChatRoomsCurrUser();
                const updatedChats = response.data;
                setUserChats({ loading: 'fulfilled', data: updatedChats });

                // Find and select the new chat
                const newChat = updatedChats[updatedChats.length - 1];
                if (newChat) {
                    // Navigate to the new chat
                    navigate(`/chat/${newChat.id}`, { replace: true });
                    setActiveChat(newChat);
                    setMessageList(newChat.messages);
                }

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
                        <MobileChat
                            activeChat={activeChat}
                            setActiveChat={setActiveChat}
                            setMessageList={setMessageList}
                            messageList={messageList}
                            chatId={chatId}
                            handleSendSocketMessage={handleSendSocketMessage}
                            userChats={userChats}
                            formatMessageTime={formatMessageTime}
                            newMessage={newMessage}
                            setNewMessage={setNewMessage}
                            inputRef={inputRef}
                            sendingChat={sendingChat}
                            setOpen={setOpen}
                        />
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
                                                    onClick={() => handleChatSelection(chat)}
                                                    sx={{
                                                        cursor: 'pointer',
                                                        bgcolor: activeChat?.id === chat?.id ? 'lightgray' : 'transparent', // Change background if selected
                                                        '&:hover': { bgcolor: 'action.hover' }, // Add a hover effect
                                                        borderRadius: 2, // Optional for rounded edges
                                                    }}
                                                >
                                                    <ListItemAvatar>
                                                        <Badge
                                                            badgeContent={chat.unread_count}
                                                            color="error"
                                                            overlap="circular"
                                                        >
                                                            <Avatar src={receiver?.profile?.avatar || ""} alt={receiver?.profile?.name || "User"} />
                                                        </Badge>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={receiver?.profile?.name || "Unknown User"}
                                                    />
                                                </ListItem>
                                            );
                                        })}
                                    </List>
                                ) : (
                                    <Box sx={{ p: 2, textAlign: 'center' }}>
                                        <CircularProgress size={24} />
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            Loading chats...
                                        </Typography>
                                    </Box>
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
                                            boxShadow: "0px 2px 4px rgba(0,0,0, 0.1)",
                                            minHeight: "70px",
                                        }}
                                    >
                                        <Typography variant="h6" sx={{ color: "#000" }}>
                                            {
                                                activeChat?.participants?.find(
                                                    (p) => p.profile?.id !== profile?.profile?.profile?.id
                                                )?.profile?.name || "Unknown User"
                                            }
                                        </Typography>
                                    </Box>

                                    <Box
                                        ref={scrollRef}
                                        flexGrow={1}
                                        overflow="auto"
                                        padding={2}
                                        display="flex"
                                        flexDirection="column"
                                        justifyContent="flex-end"
                                        bgcolor="#f9f9f9"
                                    >
                                        <ScrollableFeed>
                                            {messageList && messageList.length > 0 ? (
                                                messageList.map((msg, index) => {
                                                    const isSentByCurrentUser =
                                                        msg.sender?.id === profile?.profile?.profile?.id;
                                                    const showDate =
                                                        index === 0 ||
                                                        new Date(msg.timestamp).toDateString() !==
                                                        new Date(messageList[index - 1].timestamp).toDateString();

                                                    return (
                                                        <React.Fragment key={index}>
                                                            {showDate && (
                                                                <Box
                                                                    sx={{
                                                                        display: "flex",
                                                                        justifyContent: "center",
                                                                        my: 2,
                                                                    }}
                                                                >
                                                                    <Typography
                                                                        variant="caption"
                                                                        sx={{
                                                                            bgcolor: "rgba(0,0,0,0.05)",
                                                                            px: 2,
                                                                            py: 0.5,
                                                                            borderRadius: 10,
                                                                            color: "text.secondary",
                                                                        }}
                                                                    >
                                                                        {new Date(msg.timestamp).toLocaleDateString([], {
                                                                            weekday: "short",
                                                                            month: "short",
                                                                            day: "numeric",
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
                                                                                fontWeight: "medium",
                                                                            }}
                                                                        >
                                                                            {msg.sender?.name || "Unknown User"}
                                                                        </Typography>
                                                                    )}

                                                                    <Paper
                                                                        elevation={0}
                                                                        sx={{
                                                                            p: 1.5,
                                                                            bgcolor: isSentByCurrentUser
                                                                                ? theme.palette.primary.main
                                                                                : "#fff",
                                                                            color: isSentByCurrentUser ? "#fff" : "text.primary",
                                                                            borderRadius: isSentByCurrentUser
                                                                                ? "18px 18px 4px 18px"
                                                                                : "18px 18px 18px 4px",
                                                                            boxShadow: "0px 1px 2px rgba(0,0,0,0.08)",
                                                                            wordBreak: "break-word",
                                                                        }}
                                                                    >
                                                                        <Typography variant="body1">{msg.content}</Typography>
                                                                        <Typography
                                                                            variant="caption"
                                                                            sx={{
                                                                                display: "block",
                                                                                textAlign: "right",
                                                                                mt: 0.5,
                                                                                opacity: 0.8,
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
                                            inputRef={inputRef}
                                            sx={{ marginRight: 2 }}
                                        />
                                        <IconButton
                                            color="primary"
                                            onClick={handleSendSocketMessage}
                                            disabled={!newMessage.trim()}
                                            sx={{
                                                borderRadius: "12px",
                                                width: 50,
                                                height: 50,
                                                border: "1px solid",
                                            }}
                                        >
                                            <SendIcon />
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