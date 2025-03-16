import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  ListItemSecondaryAction,
  Button, 
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Tooltip
} from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DescriptionIcon from '@mui/icons-material/Description';

const FileSharing = ({ tripId, files = [], onFileUpload, onFileDelete, loading = false }) => {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile && onFileUpload) {
      onFileUpload(tripId, selectedFile);
      setSelectedFile(null);
      setUploadDialogOpen(false);
    }
  };

  const openDeleteDialog = (file) => {
    setFileToDelete(file);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (fileToDelete && onFileDelete) {
      onFileDelete(tripId, fileToDelete.id);
      setFileToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return <ImageIcon />;
    if (fileType === 'application/pdf') return <PictureAsPdfIcon />;
    if (fileType.includes('document') || fileType.includes('sheet')) return <DescriptionIcon />;
    return <InsertDriveFileIcon />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" component="h2">Trip Files</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<UploadFileIcon />}
          onClick={() => setUploadDialogOpen(true)}
        >
          Upload File
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" my={3}>
          <CircularProgress />
        </Box>
      ) : files.length === 0 ? (
        <Box textAlign="center" py={3}>
          <Typography variant="body1" color="textSecondary">
            No files have been shared yet for this trip.
          </Typography>
        </Box>
      ) : (
        <List>
          {files.map((file) => (
            <ListItem key={file.id} divider>
              <ListItemIcon>
                {getFileIcon(file.type)}
              </ListItemIcon>
              <ListItemText
                primary={file.name}
                secondary={
                  <React.Fragment>
                    <Typography component="span" variant="body2" color="textSecondary">
                      {formatFileSize(file.size)} • Uploaded by {file.uploadedBy} • {formatDate(file.uploadDate)}
                    </Typography>
                  </React.Fragment>
                }
              />
              <ListItemSecondaryAction>
                <Tooltip title="Download">
                  <IconButton edge="end" aria-label="download" onClick={() => window.open(file.url)}>
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
                {file.canDelete && (
                  <Tooltip title="Delete">
                    <IconButton edge="end" aria-label="delete" onClick={() => openDeleteDialog(file)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)}>
        <DialogTitle>Upload File</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Choose a file to share with trip participants. Maximum file size: 25MB.
          </DialogContentText>
          <Box mt={2}>
            <input
              accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              style={{ display: 'none' }}
              id="file-upload-button"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload-button">
              <Button variant="outlined" component="span" fullWidth>
                Select File
              </Button>
            </label>
            {selectedFile && (
              <Box mt={1}>
                <Typography variant="body2">
                  Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            color="primary" 
            disabled={!selectedFile}
            variant="contained"
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{fileToDelete?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default FileSharing;