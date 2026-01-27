import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Stack,
  Divider,
  IconButton,
  Tooltip,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Breadcrumbs,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  ListItemButton,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Share as ShareIcon,
  Lock as LockIcon,
  Folder as FolderIcon,
  InsertDriveFile as FileIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { AppLayout } from '../../components/layout/AppLayout';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { useDocumentContext } from '../../contexts/DocumentContext';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/auth.types';
import { formatDate, formatFileSize, downloadFile, copyToClipboard, getInitials } from '../../utils/helpers';
import documentService from '../../services/documentService';
import type { Document } from '../../types/document.types';

export const DocumentViewer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedDocument, loading, error, getDocument, deleteDocument } = useDocumentContext();
  const { user } = useAuth();

  const [relatedDocuments, setRelatedDocuments] = useState<Document[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const loadDocument = async (documentId: string) => {
    try {
      await getDocument(documentId);
      await documentService.logAccess(documentId, user?.id || 'unknown');
      loadRelatedDocuments(documentId);
    } catch {
      // Error is handled by context
    }
  };

  const loadRelatedDocuments = async (documentId: string) => {
    if (!selectedDocument) return;

    try {
      const { data } = await documentService.getDocuments({
        category: selectedDocument.category,
      });
      const related = data.filter(doc => doc.id !== documentId).slice(0, 5);
      setRelatedDocuments(related);
    } catch {
      // Silent fail for related documents
    }
  };

  useEffect(() => {
    if (id) {
      loadDocument(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (selectedDocument && id) {
      loadRelatedDocuments(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDocument, id]);

  const handleDownload = async () => {
    if (!selectedDocument) return;
    try {
      const { url, filename } = await documentService.downloadDocument(selectedDocument.id);
      downloadFile(url, filename);
    } catch (err) {
      console.error('Failed to download document:', err);
    }
  };

  const handleShare = async () => {
    if (!selectedDocument) return;
    const url = `${window.location.origin}/documents/${selectedDocument.id}`;
    const success = await copyToClipboard(url);
    
    if (success) {
      alert('Link copied to clipboard!');
    } else {
      alert('Failed to copy link');
    }
  };

  const handleDelete = async () => {
    if (!selectedDocument) return;
    
    try {
      await deleteDocument(selectedDocument.id);
      setDeleteDialogOpen(false);
      navigate('/documents');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete document';
      alert(message);
    }
  };

  const canDelete = user?.role === UserRole.ADMIN || selectedDocument?.uploadedBy === user?.id;

  if (loading) {
    return (
      <AppLayout>
        <LoadingSpinner message="Loading document..." />
      </AppLayout>
    );
  }

  if (error || !selectedDocument) {
    return (
      <AppLayout>
        <EmptyState
          title="Document not found"
          description={error || "The document you're looking for doesn't exist or has been removed"}
          action={
            <Button variant="contained" onClick={() => navigate('/documents')}>
              Back to Library
            </Button>
          }
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link component={RouterLink} to="/dashboard" underline="hover" color="inherit">
            Dashboard
          </Link>
          <Link component={RouterLink} to="/documents" underline="hover" color="inherit">
            Documents
          </Link>
          <Typography color="text.primary">{selectedDocument.title}</Typography>
        </Breadcrumbs>

        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton onClick={() => navigate('/documents')}>
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="h4">{selectedDocument.title}</Typography>
                {selectedDocument.isConfidential && (
                  <Tooltip title="Confidential Document">
                    <LockIcon color="warning" />
                  </Tooltip>
                )}
              </Stack>
              {selectedDocument.description && (
                <Typography variant="body2" color="text.secondary">
                  {selectedDocument.description}
                </Typography>
              )}
            </Box>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
            >
              Download
            </Button>
            <Button
              variant="outlined"
              startIcon={<ShareIcon />}
              onClick={handleShare}
            >
              Share
            </Button>
            {canDelete && (
              <Tooltip title="Delete Document">
                <IconButton color="error" onClick={() => setDeleteDialogOpen(true)}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Stack>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        <Box sx={{ flex: { md: 2 } }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Document Preview
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Paper
                variant="outlined"
                sx={{
                  p: 4,
                  textAlign: 'center',
                  minHeight: 400,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'grey.50',
                }}
              >
                <FileIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  {selectedDocument.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {selectedDocument.type} • {formatFileSize(selectedDocument.size)}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownload}
                  sx={{ mt: 2 }}
                >
                  Download to View
                </Button>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
                  Preview not available for this file type
                </Typography>
              </Paper>
            </CardContent>
          </Card>

          {selectedDocument.accessLog.length > 0 && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Access History
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <List>
                  {selectedDocument.accessLog
                    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                    .slice(0, 10)
                    .map((log, index) => (
                      <ListItem key={index} divider={index < Math.min(selectedDocument.accessLog.length, 10) - 1}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {getInitials(log.userName)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={log.userName}
                          secondary={
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Chip
                                label={log.action.toUpperCase()}
                                size="small"
                                color={log.action === 'view' ? 'info' : log.action === 'download' ? 'success' : 'default'}
                              />
                              <Typography variant="caption">
                                {formatDate(log.timestamp, 'MMM dd, yyyy HH:mm')}
                              </Typography>
                            </Stack>
                          }
                        />
                      </ListItem>
                    ))}
                </List>
              </CardContent>
            </Card>
          )}
        </Box>

        <Box sx={{ flex: { md: 1 } }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Document Details
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Category
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={selectedDocument.category}
                      color="primary"
                      size="small"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </Box>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    File Type
                  </Typography>
                  <Typography variant="body2">
                    {selectedDocument.type}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    File Size
                  </Typography>
                  <Typography variant="body2">
                    {formatFileSize(selectedDocument.size)}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Version
                  </Typography>
                  <Typography variant="body2">
                    {selectedDocument.version}
                  </Typography>
                </Box>

                <Divider />

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Uploaded By
                  </Typography>
                  <Typography variant="body2">
                    {selectedDocument.uploadedBy}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Upload Date
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(selectedDocument.uploadedDate, 'MMM dd, yyyy HH:mm')}
                  </Typography>
                </Box>

                {selectedDocument.modifiedBy && (
                  <>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Modified By
                      </Typography>
                      <Typography variant="body2">
                        {selectedDocument.modifiedBy}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Modified Date
                      </Typography>
                      <Typography variant="body2">
                        {formatDate(selectedDocument.modifiedDate, 'MMM dd, yyyy HH:mm')}
                      </Typography>
                    </Box>
                  </>
                )}

                {selectedDocument.expiryDate && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Expiry Date
                    </Typography>
                    <Typography variant="body2" color="error">
                      {formatDate(selectedDocument.expiryDate)}
                    </Typography>
                  </Box>
                )}

                <Divider />

                <Box>
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    Tags
                  </Typography>
                  <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ mt: 1 }}>
                    {selectedDocument.tags.length > 0 ? (
                      selectedDocument.tags.map((tag) => (
                        <Chip key={tag} label={tag} size="small" variant="outlined" sx={{ mb: 0.5 }} />
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No tags
                      </Typography>
                    )}
                  </Stack>
                </Box>

                {selectedDocument.relatedTo && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Related To
                    </Typography>
                    <Typography variant="body2">
                      {selectedDocument.relatedTo.type.toUpperCase()}: {selectedDocument.relatedTo.id}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>

          {relatedDocuments.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Related Documents
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <List>
                  {relatedDocuments.map((doc, index) => (
                    <ListItemButton
                      key={doc.id}
                      onClick={() => navigate(`/documents/${doc.id}`)}
                      divider={index < relatedDocuments.length - 1}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'secondary.main' }}>
                          <FolderIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={doc.title}
                        secondary={
                          <Stack direction="row" spacing={1}>
                            <Chip
                              label={doc.category}
                              size="small"
                              sx={{ textTransform: 'capitalize' }}
                            />
                            <Typography variant="caption">
                              {formatDate(doc.uploadedDate)}
                            </Typography>
                          </Stack>
                        }
                      />
                    </ListItemButton>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}
        </Box>
      </Box>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Document</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{selectedDocument.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </AppLayout>
  );
};
