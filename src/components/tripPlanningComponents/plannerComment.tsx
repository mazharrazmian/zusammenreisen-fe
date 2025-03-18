import React, { useState, useRef, useEffect } from 'react';
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
import { toast } from 'react-toastify';

const CommentsSection = ({ loading, postID }) => {
    const [loadingMore, setLoadingMore] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [nextPage, setNextPage] = useState(null);
    const [comments, setComments] = useState([]);
    const [attachments, setAttachments] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedCommentId, setSelectedCommentId] = useState(null);
    const fileInputRef = useRef(null);

    const commentRef = useRef(null);
    const profile = useAppSelector(s => s.profile?.profile);
    
    // Keep track of the page we've loaded up to
    const loadedUpToPage = useRef(1);

    // Function to poll for new comments - only gets the first page
    const fetchNewComments = () => {
        tripService.getTripComments(postID)
        .then(res => {
            const latestComments = res.data.results;
            // Only merge new comments, don't affect pagination
            setComments(prev => {
                // Merge new comments with existing ones, avoiding duplicates
                const mergedComments = [...latestComments, ...prev].reduce((acc, comment) => {
                    if (!acc.some(c => c.id === comment.id)) {
                        acc.push(comment);
                    }
                    return acc;
                }, []);
                
                return mergedComments;
            });
            
            // Only set nextPage on initial load, not during polling
            if (loadedUpToPage.current === 1 && !nextPage) {
                setNextPage(res.data.next);
            }
        })
        .catch(err => {
            console.error("Error fetching comments:", err);
        });
    };

    // Initial load of comments
    useEffect(() => {
        if (postID) {
            fetchNewComments();
            loadedUpToPage.current = 1;
        }
    }, [postID]);

    // Set up polling
    useEffect(() => {
        let interval;

        const startPolling = () => {
            interval = setInterval(fetchNewComments, 10 * 1000); // Fetch every 10 sec
        };

        const stopPolling = () => {
            if (interval) {
                clearInterval(interval);
            }
        };

        // Listen to page visibility changes
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                fetchNewComments(); // Immediate fetch when visible
                startPolling();
            } else {
                stopPolling();
            }
        };

        // Start polling when the component mounts
        startPolling();
        document.addEventListener("visibilitychange", handleVisibilityChange);

        // Cleanup function
        return () => {
            stopPolling();
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [postID]);

    const loadMoreComments = () => {
        if (!nextPage) return; // Stop if no more pages

        setLoadingMore(true);

        tripService.loadMoreComments(nextPage)
            .then(res => {
                loadedUpToPage.current += 1;
                
                // Append new comments at the end
                setComments(prev => {
                    // Ensure no duplicates when appending
                    const newComments = res.data.results.filter(
                        newComment => !prev.some(c => c.id === newComment.id)
                    );
                    return [...prev, ...newComments];
                });
                
                // Update pagination
                setNextPage(res.data.next);
            })
            .catch(err => {
                console.log(err);
                handleApiError(err);
            })
            .finally(() => setLoadingMore(false));
    };

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
        
        tripService.createComment(formData)
            .then(res => {
                setComments(prev => [res.data, ...prev]);
                setNewComment('');
                setAttachments([]);
            })
            .catch(err => {
                console.log(err);
                handleApiError(err);
            });
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
        tripService.deleteComment(selectedCommentId)
            .then(res => {
                toast('Comment Deleted');
                setComments(prev => prev.filter(comment => comment.id !== selectedCommentId));
            })
            .catch(err => {
                console.log(err);
                handleApiError(err);
            });
    };

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>Discussion</Typography>

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
                                    <Typography key={index} variant="caption" color="text.secondary" display="block">
                                        {file.name}
                                    </Typography>
                                ))}
                            </Box>
                        )}
                    </Grid>
                </Grid>
            </Box>

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
                                    <Avatar alt={comment.profile?.user.name} src={comment?.profile?.picture} />
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
                                            {comment.profile.user.id === profile?.user?.id && (
                                                <IconButton size="small" onClick={(e) => handleMoreClick(e, comment.id)}>
                                                    <MoreVert fontSize="small" />
                                                </IconButton>
                                            )}
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
                                                        <Box key={attachment.id} mb={0.5}>
                                                            <a href={attachment.file} target="_blank" rel="noopener noreferrer">
                                                                📎 {attachment.file.split("/").pop()}
                                                            </a>
                                                        </Box>
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

            {!loading && nextPage && (
                <Box textAlign="center" mb={2}>
                    <Button
                        variant="outlined"
                        startIcon={loadingMore ? <CircularProgress size={20} /> : null}
                        disabled={loadingMore}
                        onClick={loadMoreComments}
                    >
                        {loadingMore ? 'Loading...' : 'Load Older Comments'}
                    </Button>
                </Box>
            )}
        </Paper>
    );
};

export default CommentsSection;