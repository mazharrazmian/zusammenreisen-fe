import { Add, ArrowBack, MessageOutlined as SendIcon } from "@mui/icons-material";
import { Box, IconButton, Avatar, Typography, Paper, TextField, CircularProgress, List, ListItem, ListItemAvatar, ListItemText, useTheme } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Iconify from "../iconify";
import noChat from '../../assets/chat.svg'
import { ChatRoom, UserChats } from "../../types";
import { useAppSelector } from "../../redux/store";


interface MobileChatProps {
    activeChat: any;
    setActiveChat: (chat: any) => void;
    messageList: any[];
    handleSendSocketMessage: (message?: string) => void;
    setMessageList: (messages: any[]) => void;
    userChats: UserChats;
    formatMessageTime: (timestamp: string) => string;
    newMessage: string;
    setNewMessage: (message: string) => void;
    inputRef: any;
    setOpen: (status: boolean) => void;
    sendingChat: boolean;
}
  
const MobileChat: React.FC<MobileChatProps> = ({
    activeChat,
    setActiveChat,
    messageList,
    handleSendSocketMessage,
    setMessageList,
    userChats,
    formatMessageTime,
    newMessage,
    setNewMessage,
    inputRef,
    setOpen,
    sendingChat
}) => {
    const profile = useAppSelector((s) => s.profile);
    const navigate = useNavigate();
    const { chatId } = useParams(); // Get chatId from URL params
    const scrollRef = useRef<HTMLDivElement>(null);
    const theme = useTheme();

    // Find the current chat when chatId changes
    useEffect(() => {
        if (chatId && userChats.data) {
            const chat = userChats.data.find(c => c.id === chatId);
            if (chat) {
                setActiveChat(chat);
                setMessageList(chat.messages);
            }
        }
    }, [chatId, userChats.data, setActiveChat, setMessageList]);

    useEffect(() => {
        // Scroll to bottom when new messages arrive
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messageList]);

    return (
        !chatId ? (
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
                                            navigate(`/chat/${chat.id}`); // Navigate to chat detail route
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
                                                lastMsg ? (
                                                    <Typography noWrap variant="body2" color="text.secondary">
                                                        {lastMsg.content}
                                                    </Typography>
                                                ) : "No messages yet"
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
                        position: "fixed", // Changed from sticky to fixed
                        top: 70,
                        left: 0,
                        width: "100%", // Ensure it stretches across the screen
                        zIndex: 10, // Increase z-index to ensure it's always above other elements
                    }}
                >
                    <IconButton 
                        onClick={() => navigate('/chat')}
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
                        paddingTop: "70px", // Add padding to account for fixed header
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
                        onClick={() => handleSendSocketMessage()}
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
    );
};

export default MobileChat;