// MessageList.jsx
import React, { useRef, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Avatar, 
  Paper, 
  CircularProgress,
  Divider
} from '@mui/material';
import { format } from 'date-fns';
import { styled } from '@mui/system';

const MessageBubble = styled(Paper)(({ theme, isCurrentUser }) => ({
  padding: theme.spacing(1.5),
  maxWidth: '75%',
  borderRadius: isCurrentUser 
    ? '20px 20px 4px 20px'
    : '20px 20px 20px 4px',
  backgroundColor: isCurrentUser 
    ? theme.palette.primary.light 
    : theme.palette.grey[100],
  color: isCurrentUser 
    ? theme.palette.primary.contrastText 
    : theme.palette.text.primary,
  marginLeft: isCurrentUser ? 'auto' : 0,
  marginRight: isCurrentUser ? 0 : 'auto',
  wordBreak: 'break-word'
}));

const MessageList = ({ messages, currentUserId, loading }) => {
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = message.timestamp.split('T')[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return format(date, 'MMMM d, yyyy');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (messages.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flexDirection: 'column' }}>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
          No messages yet
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Be the first to start the conversation!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <Box key={date} sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Typography variant="caption" sx={{ px: 2, py: 0.5, bgcolor: 'grey.200', borderRadius: 4 }}>
              {formatDate(date)}
            </Typography>
          </Box>
          
          {dateMessages.map((message, index) => {
            const isCurrentUser = message.userId === currentUserId;
            const showAvatar = index === 0 || dateMessages[index - 1]?.userId !== message.userId;
            const timeFormatted = format(new Date(message.timestamp), 'h:mm a');
            
            return (
              <Box key={message.id} sx={{ mb: 2, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 0.5 }}>
                  {!isCurrentUser && showAvatar && (
                    <Avatar 
                      src={message.user?.avatar} 
                      alt={message.user?.name}
                      sx={{ mr: 1, width: 32, height: 32 }}
                    />
                  )}
                  
                  {!isCurrentUser && !showAvatar && (
                    <Box sx={{ width: 32, mr: 1 }} />
                  )}
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: '75%' }}>
                    {showAvatar && !isCurrentUser && (
                      <Typography variant="caption" sx={{ ml: 1, mb: 0.5 }}>
                        {message.user?.name}
                      </Typography>
                    )}
                    
                    <MessageBubble isCurrentUser={isCurrentUser}>
                      <Typography variant="body1">
                        {message.text}
                      </Typography>
                      
                      {message.attachments && message.attachments.length > 0 && (
                        <Box sx={{ mt: 1 }}>
                          {message.attachments.map(attachment => (
                            <Box 
                              key={attachment.id} 
                              component="a" 
                              href={attachment.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              sx={{ 
                                display: 'block', 
                                bgcolor: 'rgba(0,0,0,0.05)', 
                                p: 1, 
                                borderRadius: 1,
                                mb: 1,
                                textDecoration: 'none',
                                color: 'inherit'
                              }}
                            >
                              <Typography variant="body2">
                                {attachment.name}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </MessageBubble>
                    
                    <Typography variant="caption" sx={{ 
                      alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
                      mt: 0.5,
                      px: 1
                    }}>
                      {timeFormatted}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      ))}
      <div ref={messagesEndRef} />
    </Box>
  );
};

// MessageInput.jsx
import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  IconButton, 
  Button,
  Tooltip,
  CircularProgress,
  Paper
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [sending, setSending] = useState(false);
  const fileInputRef = React.useRef();

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSend = async () => {
    if (!message.trim() && attachments.length === 0) return;
    
    try {
      setSending(true);
      await onSendMessage(message, attachments);
      setMessage('');
      setAttachments([]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setAttachments([...attachments, ...files]);
    e.target.value = null; // Reset input value
  };

  const handleAttachClick = () => {
    fileInputRef.current.click();
  };

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  return (
    <Box>
      {attachments.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {attachments.map((file, index) => (
            <Paper 
              key={index} 
              variant="outlined" 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                p: 0.5, 
                pl: 1.5, 
                borderRadius: 2 
              }}
            >
              <Typography variant="body2" sx={{ mr: 1 }}>
                {file.name}
              </Typography>
              <IconButton size="small" onClick={() => removeAttachment(index)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Paper>
          ))}
        </Box>
      )}
      
      <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
        <Tooltip title="Attach files">
          <IconButton 
            color="primary" 
            aria-label="attach file"
            onClick={handleAttachClick}
          >
            <AttachFileIcon />
          </IconButton>
        </Tooltip>
        <input
          type="file"
          multiple
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />
        
        <TextField
          fullWidth
          multiline
          maxRows={4}
          placeholder="Type a message..."
          variant="outlined"
          value={message}
          onChange={handleMessageChange}
          onKeyPress={handleKeyPress}
          sx={{ mx: 1 }}
          InputProps={{
            sx: { borderRadius: 3, py: 1 }
          }}
        />
        
        <IconButton 
          color="primary" 
          aria-label="send message" 
          onClick={handleSend}
          disabled={sending || (!message.trim() && attachments.length === 0)}
        >
          {sending ? <CircularProgress size={24} /> : <SendIcon />}
        </IconButton>
      </Box>
    </Box>
  );
};

export default MessageList;
export { MessageInput };