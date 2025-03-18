import React, { useState, useRef } from 'react';
import { 
  Paper, Typography, Box, Avatar, TextField, Button, 
  List, ListItem, ListItemAvatar, ListItemText, Divider,
  CircularProgress, IconButton, Grid, Skeleton, Menu, MenuItem
} from '@mui/material';
import { Send, AttachFile, MoreVert } from '@mui/icons-material';
import moment from 'moment';
import { useAppSelector } from '../../redux/store';
import { tripService } from '../../redux/api/tripPlanningService';
import { handleApiError } from '../../redux/api/http-common';

const CommentsSection = ({ comments, loading, postID, onCommentDelete, onCommentAdd }) => {
  const [loadingMore, setLoadingMore] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const fileInputRef = useRef(null);

  const commentRef = useRef(null);

  const profile = useAppSelector(s => s.profile?.profile);

  const handleFileChange = (e) => {
    setAttachments([...e.target.files]);
  };

  const handleAddComment = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("post", postID);
    formData.append("text", newComment);
    
    // Append all selected files
    attachments.forEach(file => {
      formData.append("attachments_post", file);
    });
    onCommentAdd(formData)
    setNewComment('')
    setAttachments([])

  };


  const handleMoreClick = (event, commentId) => {
    setAnchorEl(event.currentTarget);
    setSelectedCommentId(commentId);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedCommentId(null);
  };

  const handleDelete = () => {
    handleClose();
    if (onCommentDelete) {
      onCommentDelete(selectedCommentId);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight="bold" mb={2}>Discussion</Typography>

      {!loading && hasMore && (
        <Box textAlign="center" mb={2}>
          <Button 
            variant="outlined" 
            disabled={loadingMore}
            startIcon={loadingMore ? <CircularProgress size={20} /> : null}
            
          >
            {loadingMore ? 'Loading...' : 'Load Older Comments'}
          </Button>
        </Box>
      )}

      {/* Comments List */}
      {loading ? (
        Array.from(new Array(5)).map((_, index) => (
          <Box key={index} sx={{ display: 'flex', mb: 3 }}>
            <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
            <Box width="100%">
              <Skeleton variant="text" width="30%" />
              <Skeleton variant="text" width="90%" />
              <Skeleton variant="text" width="60%" />
            </Box>
          </Box>
        ))
      ) : (
        <List>
          {comments?.map((comment) => (
            <React.Fragment key={comment.id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar alt={comment.profile.user.name} src={comment.profile.picture} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="subtitle2" fontWeight="medium">
                        {comment.profile.user.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {moment(comment.timestamp).fromNow()}
                      </Typography>
                      <IconButton size="small" onClick={(e) => handleMoreClick(e, comment.id)}>
                          <MoreVert fontSize="small" />
                        </IconButton>
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.primary" sx={{ mt: 0.5, mb: 1 }}>
                        {comment.text}
                      </Typography>
                      {comment.attachments?.length > 0 && (
                        <Box mt={1}>
                          {comment.attachments.map((attachment) => (
                            <a key={attachment.id} href={attachment.file} target="_blank" rel="noopener noreferrer">
                              📎 {attachment.file.split("/").pop()}
                            </a>
                          ))}
                        </Box>
                      )}
                    </>
                  }
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
      <MenuItem onClick={handleDelete}>Delete</MenuItem>
    </Menu>

        </List>
      )}

      {/* New Comment Form */}
      <Box component="form" onSubmit={handleAddComment} mt={3}>
        <Grid container spacing={2}>
          <Grid item>
            <Avatar alt={profile?.name} src={profile?.picture} />
          </Grid>
          <Grid item xs>
            <TextField
              fullWidth
              multiline
              rows={2}
              placeholder="Share your thoughts or ideas about the trip..."
              variant="outlined"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Box display="flex" justifyContent="space-between" mt={1}>
              <input
                type="file"
                multiple
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <Button startIcon={<AttachFile />} size="small" color="secondary" onClick={() => fileInputRef.current.click()}>
                Attach
              </Button>
              <Button type="submit" variant="contained" endIcon={<Send />} disabled={!newComment.trim()}>
                Post
              </Button>
            </Box>
            {/* Display selected file names */}
          {attachments.length > 0 && (
            <Box mt={0}>
              {attachments.map((file, index) => (
                <Typography key={index} variant="caption" color="text.secondary">
                  {file.name}
                </Typography>
              ))}
            </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default CommentsSection;
