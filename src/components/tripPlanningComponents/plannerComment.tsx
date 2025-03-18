import React, { useState, useRef, useEffect } from 'react';
import {
    Paper, Typography, Box, Avatar, TextField, Button,
    List, ListItem, ListItemAvatar, ListItemText, Divider,
    CircularProgress, IconButton, Grid, Skeleton, Menu, MenuItem,
    Card, CardContent, Fade, Zoom, Collapse, Chip
} from '@mui/material';
import { Send, AttachFile, MoreVert, Comment as CommentIcon, AccessTime } from '@mui/icons-material';
import moment from 'moment';
import { useAppSelector } from '../../redux/store';
import { tripService } from '../../redux/api/tripPlanningService';
import { handleApiError } from '../../redux/api/http-common';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

// Framer Motion animation variants
const commentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3, ease: "easeIn" } }
};

const loadMoreVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.3 } }
};

const CommentsSection = ({ loading, postID }) => {
    const [loadingMore, setLoadingMore] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [nextPage, setNextPage] = useState(null);
    const [comments, setComments] = useState([]);
    const [attachments, setAttachments] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedCommentId, setSelectedCommentId] = useState(null);
    const [showNewCommentIndicator, setShowNewCommentIndicator] = useState(false);
    const [expandedCommentId, setExpandedCommentId] = useState(null);
    const [commentAddedAnimation, setCommentAddedAnimation] = useState(false);
    
    const fileInputRef = useRef(null);
    const commentRef = useRef(null);
    const topRef = useRef(null);
    const profile = useAppSelector(s => s.profile?.profile);
    
    // Keep track of the page we've loaded up to
    const loadedUpToPage = useRef(1);
    // Keep track of comment IDs to animate new comments
    const prevCommentIds = useRef(new Set());

    // Function to poll for new comments - only gets the first page
    const fetchNewComments = () => {
        tripService.getTripComments(postID)
        .then(res => {
            const latestComments = res.data.results;
            // Check if there are new comments
            const hasNewComments = latestComments.some(comment => 
                !prevCommentIds.current.has(comment.id)
            );
            
            if (hasNewComments) {
                setShowNewCommentIndicator(true);
            }
            
            // Only merge new comments, don't affect pagination
            setComments(prev => {
                // Merge new comments with existing ones, avoiding duplicates
                const mergedComments = [...latestComments, ...prev].reduce((acc, comment) => {
                    if (!acc.some(c => c.id === comment.id)) {
                        acc.push(comment);
                    }
                    return acc;
                }, []);
                
                // Update prevCommentIds reference
                mergedComments.forEach(comment => {
                    prevCommentIds.current.add(comment.id);
                });
                
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
            prevCommentIds.current = new Set();
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
                    
                    // Update prevCommentIds reference
                    newComments.forEach(comment => {
                        prevCommentIds.current.add(comment.id);
                    });
                    
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
                setCommentAddedAnimation(true);
                prevCommentIds.current.add(res.data.id);
                setComments(prev => [res.data, ...prev]);
                setNewComment('');
                setAttachments([]);
                
                // Reset animation state after a delay
                setTimeout(() => {
                    setCommentAddedAnimation(false);
                }, 1000);
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
        
        // Find the comment to be deleted
        const commentToDelete = comments.find(comment => comment.id === selectedCommentId);
        
        if (!commentToDelete) return;
        
        // First update UI by removing the comment
        setComments(prev => prev.filter(comment => comment.id !== selectedCommentId));
        
        // Then make API call
        tripService.deleteComment(selectedCommentId,postID)
            .then(res => {
                toast.success('Comment deleted successfully', {
                    position: "bottom-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                
                // Remove from prevCommentIds
                prevCommentIds.current.delete(selectedCommentId);
            })
            .catch(err => {
                console.log(err);
                handleApiError(err);
                
                // Restore the comment if deletion fails
                setComments(prev => [...prev, commentToDelete].sort((a, b) => 
                    new Date(b.timestamp) - new Date(a.timestamp)
                ));
            });
    };
    
    const scrollToTop = () => {
        topRef.current?.scrollIntoView({ behavior: 'smooth' });
        setShowNewCommentIndicator(false);
    };
    
    const toggleExpandComment = (commentId) => {
        if (expandedCommentId === commentId) {
            setExpandedCommentId(null);
        } else {
            setExpandedCommentId(commentId);
        }
    };

    return (
        <Paper elevation={3} sx={{ 
            p: 3, 
            borderRadius: 2, 
            position: 'relative',
            backgroundImage: 'linear-gradient(to bottom, rgba(245,245,245,0.8), rgba(255,255,255,1))',
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
        }}>
            <Box ref={topRef} />
            <Typography variant="h6" fontWeight="bold" mb={2} sx={{ 
                display: 'flex', 
                alignItems: 'center',
                color: 'primary.main'
            }}>
                <CommentIcon sx={{ mr: 1 }} />
                Discussion
                <Chip 
                    size="small" 
                    label={`${comments.length} comments`} 
                    sx={{ ml: 2, backgroundColor: 'rgba(0,0,0,0.06)' }}
                />
            </Typography>

            {/* New Comment Form */}
            <Card sx={{ 
                mb: 3, 
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease',
                '&:hover': { 
                    boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
                    transform: 'translateY(-2px)'
                }
            }}>
                <CardContent>
                    <Box component="form" onSubmit={handleAddComment}>
                        <Grid container spacing={2}>
                            <Grid item>
                                <Avatar 
                                    alt={profile?.name} 
                                    src={profile?.picture} 
                                    sx={{ 
                                        width: 48, 
                                        height: 48,
                                        boxShadow: '0 3px 6px rgba(0,0,0,0.1)'
                                    }} 
                                />
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
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            transition: 'all 0.3s ease',
                                            '&.Mui-focused': {
                                                boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.1)'
                                            }
                                        }
                                    }}
                                />
                                <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                                    <Box>
                                        <input
                                            type="file"
                                            multiple
                                            ref={fileInputRef}
                                            style={{ display: 'none' }}
                                            onChange={handleFileChange}
                                        />
                                        <Button 
                                            startIcon={<AttachFile />} 
                                            size="small" 
                                            color="secondary" 
                                            onClick={() => fileInputRef.current.click()}
                                            sx={{ 
                                                borderRadius: 4,
                                                transition: 'all 0.2s ease',
                                                '&:hover': { 
                                                    backgroundColor: 'rgba(156, 39, 176, 0.08)'
                                                }
                                            }}
                                        >
                                            Attach
                                        </Button>
                                    </Box>
                                    <Zoom in={!!newComment.trim()} timeout={300}>
                                        <Button 
                                            type="submit" 
                                            variant="contained" 
                                            endIcon={<Send />} 
                                            disabled={!newComment.trim()}
                                            sx={{ 
                                                borderRadius: 4,
                                                boxShadow: '0 4px 10px rgba(25, 118, 210, 0.2)',
                                                transition: 'all 0.3s ease',
                                                '&:hover': { 
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 6px 14px rgba(25, 118, 210, 0.3)'
                                                }
                                            }}
                                        >
                                            Post
                                        </Button>
                                    </Zoom>
                                </Box>
                                {/* Display selected file names */}
                                <Collapse in={attachments.length > 0}>
                                    <Box mt={1} sx={{ backgroundColor: 'rgba(0,0,0,0.03)', p: 1, borderRadius: 1 }}>
                                        {attachments.map((file, index) => (
                                            <Typography key={index} variant="caption" color="text.secondary" display="block">
                                                📎 {file.name}
                                            </Typography>
                                        ))}
                                    </Box>
                                </Collapse>
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
            </Card>

            {/* New Comment Notification */}
            {showNewCommentIndicator && (
                <Fade in={showNewCommentIndicator}>
                    <Box 
                        sx={{ 
                            display: 'flex',
                            justifyContent: 'center',
                            mb: 2
                        }}
                    >
                        <Button
                            variant="text"
                            color="primary"
                            onClick={scrollToTop}
                            sx={{ 
                                animation: 'pulse 2s infinite',
                                '@keyframes pulse': {
                                    '0%': { boxShadow: '0 0 0 0 rgba(25, 118, 210, 0.4)' },
                                    '70%': { boxShadow: '0 0 0 10px rgba(25, 118, 210, 0)' },
                                    '100%': { boxShadow: '0 0 0 0 rgba(25, 118, 210, 0)' }
                                }
                            }}
                        >
                            New comments available ↑
                        </Button>
                    </Box>
                </Fade>
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
                <List sx={{ mt: 2 }}>
                    <AnimatePresence>
                        {comments?.map((comment, index) => (
                            <motion.div
                                key={comment.id}
                                variants={commentVariants}
                                initial={index === 0 && commentAddedAnimation ? "hidden" : false}
                                animate="visible"
                                exit="exit"
                                layout
                            >
                                <Card sx={{ 
                                    mb: 2, 
                                    backgroundColor: index === 0 && commentAddedAnimation ? 'rgba(25, 118, 210, 0.04)' : 'white',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': { 
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                                    }
                                }}>
                                    <CardContent sx={{ p: 2 }}>
                                        <Box display="flex" alignItems="flex-start">
                                            <Avatar 
                                                alt={comment.profile?.user.name} 
                                                src={comment?.profile?.picture} 
                                                sx={{ 
                                                    width: 40, 
                                                    height: 40, 
                                                    mr: 2,
                                                    border: '2px solid #fff',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                }}
                                            />
                                            <Box flexGrow={1}>
                                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                                    <Typography variant="subtitle2" fontWeight="bold">
                                                        {comment.profile.user.name}
                                                    </Typography>
                                                    <Box display="flex" alignItems="center">
                                                        <AccessTime sx={{ fontSize: 14, marginRight: 0.5, color: 'text.secondary' }} />
                                                        <Typography variant="caption" color="text.secondary">
                                                            {moment(comment.timestamp).fromNow()}
                                                        </Typography>
                                                        {comment.profile.user.id === profile?.user?.id && (
                                                            <IconButton 
                                                                size="small" 
                                                                onClick={(e) => handleMoreClick(e, comment.id)}
                                                                sx={{ ml: 1 }}
                                                            >
                                                                <MoreVert fontSize="small" />
                                                            </IconButton>
                                                        )}
                                                    </Box>
                                                </Box>
                                                <Box 
                                                    sx={{ 
                                                        mt: 1, 
                                                        maxHeight: expandedCommentId === comment.id ? 'none' : '100px',
                                                        overflow: 'hidden',
                                                        position: 'relative',
                                                    }}
                                                >
                                                    <Typography variant="body2" color="text.primary">
                                                        {comment.text}
                                                    </Typography>
                                                    
                                                    {/* Show "Read more" if text is long */}
                                                    {comment.text.length > 280 && (
                                                        <Box 
                                                            sx={{
                                                                position: expandedCommentId !== comment.id ? 'absolute' : 'relative',
                                                                bottom: 0,
                                                                left: 0,
                                                                width: '100%',
                                                                textAlign: 'right',
                                                                pt: expandedCommentId !== comment.id ? 2 : 0,
                                                                background: expandedCommentId !== comment.id ? 
                                                                    'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1))' : 'none',
                                                            }}
                                                        >
                                                            <Button 
                                                                variant="text" 
                                                                size="small" 
                                                                onClick={() => toggleExpandComment(comment.id)}
                                                                sx={{ textTransform: 'none' }}
                                                            >
                                                                {expandedCommentId === comment.id ? 'Show less' : 'Read more'}
                                                            </Button>
                                                        </Box>
                                                    )}
                                                </Box>
                                                {comment.attachments?.length > 0 && (
                                                    <Box mt={1} sx={{ 
                                                        backgroundColor: 'rgba(0,0,0,0.03)', 
                                                        p: 1, 
                                                        borderRadius: 1,
                                                    }}>
                                                        {comment.attachments.map((attachment) => (
                                                            <Box key={attachment.id} mb={0.5}>
                                                                <a 
                                                                    href={attachment.file} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer"
                                                                    style={{ 
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        textDecoration: 'none',
                                                                        color: '#1565c0',
                                                                        fontSize: '0.875rem'
                                                                    }}
                                                                >
                                                                    <AttachFile sx={{ fontSize: 16, mr: 0.5 }} />
                                                                    {attachment.file.split("/").pop()}
                                                                </a>
                                                            </Box>
                                                        ))}
                                                    </Box>
                                                )}
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    <Menu 
                        anchorEl={anchorEl} 
                        open={Boolean(anchorEl)} 
                        onClose={handleClose}
                        TransitionComponent={Fade}
                        PaperProps={{
                            elevation: 3,
                            sx: { borderRadius: 2 }
                        }}
                    >
                        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>Delete</MenuItem>
                    </Menu>
                </List>
            )}

            {/* Load More Button */}
            {!loading && nextPage && (
                <Box textAlign="center" mb={2}>
                    <motion.div
                        variants={loadMoreVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        <Button
                            variant="outlined"
                            startIcon={loadingMore ? <CircularProgress size={20} /> : null}
                            disabled={loadingMore}
                            onClick={loadMoreComments}
                            sx={{ 
                                borderRadius: 4,
                                px: 3,
                                py: 1,
                                transition: 'all 0.3s ease',
                                '&:not(:disabled):hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                }
                            }}
                        >
                            {loadingMore ? 'Loading...' : 'Load Older Comments'}
                        </Button>
                    </motion.div>
                </Box>
            )}
        </Paper>
    );
};

export default CommentsSection;