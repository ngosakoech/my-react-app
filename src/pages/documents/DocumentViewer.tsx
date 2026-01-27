import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  Breadcrumbs,
  Link,
  IconButton,
  Paper,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { mockDocuments } from '../../mocks/documents.mock';
import { Document } from '../../types';
import { format } from 'date-fns';

export const DocumentViewer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [document, setDocument] = useState<Document | null>(null);

  useEffect(() => {
    const loadDocument = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const foundDoc = mockDocuments.find((d) => d.id === id);
        setDocument(foundDoc || null);
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, [id]);

  if (loading) {
    return <LoadingSpinner message="Loading document..." />;
  }

  if (!document) {
    return (
      <EmptyState
        title="Document not found"
        description="The document you're looking for doesn't exist"
        action={
          <Button variant="contained" onClick={() => navigate('/documents')}>
            Back to Library
          </Button>
        }
      />
    );
  }

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link
          underline="hover"
          color="inherit"
          onClick={() => navigate('/documents')}
          sx={{ cursor: 'pointer' }}
        >
          Documents
        </Link>
        <Typography color="text.primary">{document.title}</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <IconButton onClick={() => navigate('/documents')}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" gutterBottom>
            {document.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Chip label={document.category} size="small" color="primary" />
            <Chip label={document.type} size="small" />
            {document.isConfidential && (
              <Chip label="Confidential" size="small" color="error" />
            )}
          </Box>
        </Box>
        <Button startIcon={<EditIcon />} variant="outlined">
          Edit
        </Button>
        <Button startIcon={<ShareIcon />} variant="outlined">
          Share
        </Button>
        <Button startIcon={<DownloadIcon />} variant="contained">
          Download
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Paper
            sx={{
              p: 4,
              minHeight: 600,
              bgcolor: 'grey.50',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Document Preview
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Preview not available. Click download to view the document.
              </Typography>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                sx={{ mt: 2 }}
              >
                Download Document
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Document Information
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    File Size
                  </Typography>
                  <Typography variant="body2">
                    {(document.size / 1024).toFixed(2)} KB
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Version
                  </Typography>
                  <Typography variant="body2">{document.version}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Uploaded By
                  </Typography>
                  <Typography variant="body2">{document.uploadedBy}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Upload Date
                  </Typography>
                  <Typography variant="body2">
                    {format(new Date(document.uploadedDate), 'PPpp')}
                  </Typography>
                </Box>
                {document.modifiedBy && (
                  <>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Modified By
                      </Typography>
                      <Typography variant="body2">{document.modifiedBy}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Modified Date
                      </Typography>
                      <Typography variant="body2">
                        {format(new Date(document.modifiedDate!), 'PPpp')}
                      </Typography>
                    </Box>
                  </>
                )}
                {document.expiryDate && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Expiry Date
                    </Typography>
                    <Typography variant="body2">
                      {format(new Date(document.expiryDate), 'PP')}
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>

          {document.description && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Description
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2">{document.description}</Typography>
              </CardContent>
            </Card>
          )}

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tags
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {document.tags.map((tag) => (
                  <Chip key={tag} label={tag} size="small" />
                ))}
              </Box>
            </CardContent>
          </Card>

          {document.relatedTo && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Related To
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2">
                  Type: {document.relatedTo.type}
                  <br />
                  ID: {document.relatedTo.id}
                </Typography>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Access Log
              </Typography>
              <Divider sx={{ my: 2 }} />
              <List dense>
                {document.accessLog.slice(0, 5).map((log, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`${log.userName} - ${log.action}`}
                      secondary={format(new Date(log.timestamp), 'PPp')}
                    />
                  </ListItem>
                ))}
              </List>
              {document.accessLog.length > 5 && (
                <Typography variant="caption" color="text.secondary">
                  Showing 5 of {document.accessLog.length} activities
                </Typography>
              )}
            </CardContent>
          </Card>

          <Button
            variant="outlined"
            color="error"
            fullWidth
            startIcon={<DeleteIcon />}
            sx={{ mt: 2 }}
          >
            Delete Document
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
