import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Fab,
  Chip,
  IconButton,
  Tooltip,
  MenuItem,
  TextField,
  Stack,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { AppLayout } from '../../components/layout/AppLayout';
import { DataTable } from '../../components/common/DataTable';
import type { Column } from '../../components/common/DataTable';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { useDocumentContext } from '../../contexts/DocumentContext';
import { useAuth } from '../../contexts/AuthContext';
import { DocumentCategory } from '../../types/document.types';
import type { Document } from '../../types/document.types';
import { UserRole } from '../../types/auth.types';
import { formatDate, formatFileSize, downloadFile } from '../../utils/helpers';
import documentService from '../../services/documentService';

const categoryColors: Record<DocumentCategory, string> = {
  [DocumentCategory.MINUTES]: 'info',
  [DocumentCategory.FINANCIAL]: 'success',
  [DocumentCategory.POLICY]: 'warning',
  [DocumentCategory.LOAN]: 'primary',
  [DocumentCategory.AUDIT]: 'error',
  [DocumentCategory.REPORT]: 'secondary',
  [DocumentCategory.OTHER]: 'default',
};

export const DocumentLibrary = () => {
  const navigate = useNavigate();
  const { 
    documents, 
    loading, 
    error, 
    pagination,
    fetchDocuments, 
    deleteDocument,
    clearError,
  } = useDocumentContext();
  const { user } = useAuth();

  const [categoryFilter, setCategoryFilter] = useState<DocumentCategory | ''>('');
  const [uploadedByFilter, setUploadedByFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const loadDocuments = async () => {
    try {
      await fetchDocuments({
        category: categoryFilter || undefined,
        uploadedBy: uploadedByFilter || undefined,
        search: searchQuery || undefined,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      });
    } catch {
      // Error is handled by context
    }
  };

  useEffect(() => {
    loadDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFilter, uploadedByFilter, searchQuery, startDate, endDate]);

  const handleRowClick = (doc: Document) => {
    navigate(`/documents/${doc.id}`);
  };

  const handleView = (doc: Document, event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/documents/${doc.id}`);
  };

  const handleDownload = async (doc: Document, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      const { url, filename } = await documentService.downloadDocument(doc.id);
      downloadFile(url, filename);
      setSnackbar({ open: true, message: 'Document downloaded successfully', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to download document', severity: 'error' });
    }
  };

  const handleDelete = async (docs: Document[]) => {
    if (!window.confirm(`Are you sure you want to delete ${docs.length} document(s)?`)) {
      return;
    }

    try {
      for (const doc of docs) {
        await deleteDocument(doc.id);
      }
      setSnackbar({ open: true, message: 'Document(s) deleted successfully', severity: 'success' });
      loadDocuments();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete document(s)';
      setSnackbar({ open: true, message, severity: 'error' });
    }
  };

  const handleUploadClick = () => {
    navigate('/documents/upload');
  };

  const canDelete = user?.role === UserRole.ADMIN || user?.role === UserRole.SECRETARY;

  const columns: Column<Document>[] = [
    {
      id: 'title',
      label: 'Title',
      minWidth: 200,
      format: (_, row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {row.isConfidential && (
            <Tooltip title="Confidential">
              <LockIcon fontSize="small" color="warning" />
            </Tooltip>
          )}
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {row.title}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'category',
      label: 'Category',
      minWidth: 120,
      format: (value) => (
        <Chip
          label={String(value)}
          color={categoryColors[value as DocumentCategory] as 'success' | 'error' | 'warning' | 'info' | 'primary' | 'secondary' | 'default'}
          size="small"
          sx={{ textTransform: 'capitalize' }}
        />
      ),
    },
    {
      id: 'type',
      label: 'Type',
      minWidth: 100,
      format: (value) => {
        const type = String(value).split('/').pop() || 'unknown';
        return (
          <Chip label={type.toUpperCase()} size="small" variant="outlined" />
        );
      },
    },
    {
      id: 'uploadedBy',
      label: 'Uploaded By',
      minWidth: 120,
      format: (value) => String(value),
    },
    {
      id: 'uploadedDate',
      label: 'Date',
      minWidth: 120,
      format: (value) => formatDate(value as Date),
    },
    {
      id: 'size',
      label: 'Size',
      minWidth: 100,
      align: 'right',
      format: (value) => formatFileSize(value as number),
    },
    {
      id: 'tags',
      label: 'Tags',
      minWidth: 150,
      sortable: false,
      format: (value) => {
        const tags = value as string[];
        return (
          <Stack direction="row" spacing={0.5} flexWrap="wrap">
            {tags.slice(0, 3).map((tag) => (
              <Chip key={tag} label={tag} size="small" variant="outlined" sx={{ mb: 0.5 }} />
            ))}
            {tags.length > 3 && (
              <Chip label={`+${tags.length - 3}`} size="small" variant="outlined" />
            )}
          </Stack>
        );
      },
    },
    {
      id: 'id',
      label: 'Actions',
      minWidth: 150,
      align: 'center',
      sortable: false,
      format: (_, row) => (
        <Stack direction="row" spacing={0.5} justifyContent="center">
          <Tooltip title="View">
            <IconButton size="small" onClick={(e) => handleView(row, e)}>
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Download">
            <IconButton size="small" onClick={(e) => handleDownload(row, e)}>
              <DownloadIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {canDelete && (
            <Tooltip title="Delete">
              <IconButton size="small" color="error" onClick={(e) => {
                e.stopPropagation();
                handleDelete([row]);
              }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      ),
    },
  ];

  const filteredCount = documents.length;
  const totalCount = pagination?.total || 0;

  return (
    <AppLayout>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Document Library
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage and access all board documents
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
          {error}
        </Alert>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>
          <Stack spacing={2}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                select
                fullWidth
                label="Category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as DocumentCategory | '')}
                size="small"
              >
                <MenuItem value="">All Categories</MenuItem>
                {Object.values(DocumentCategory).map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                label="Uploaded By"
                value={uploadedByFilter}
                onChange={(e) => setUploadedByFilter(e.target.value)}
                size="small"
                placeholder="User ID"
              />
              <TextField
                fullWidth
                type="date"
                label="Start Date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                size="small"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                type="date"
                label="End Date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                size="small"
                InputLabelProps={{ shrink: true }}
              />
            </Stack>
            <TextField
              fullWidth
              label="Search by title, tags, or description"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              placeholder="Search documents..."
            />
          </Stack>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Showing {filteredCount} of {totalCount} documents
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                setCategoryFilter('');
                setUploadedByFilter('');
                setSearchQuery('');
                setStartDate('');
                setEndDate('');
              }}
            >
              Clear Filters
            </Button>
          </Box>
        </CardContent>
      </Card>

      {loading ? (
        <LoadingSpinner message="Loading documents..." />
      ) : documents.length === 0 ? (
        <EmptyState
          title="No documents found"
          description={searchQuery || categoryFilter ? "Try adjusting your filters" : "Upload your first document to get started"}
          action={
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleUploadClick}
            >
              Upload Document
            </Button>
          }
        />
      ) : (
        <DataTable<Document & Record<string, unknown>>
          columns={columns as Column<Document & Record<string, unknown>>[]}
          rows={documents as (Document & Record<string, unknown>)[]}
          rowKey="id"
          title="Documents"
          selectable={canDelete}
          onDelete={canDelete ? (selected) => handleDelete(selected as Document[]) : undefined}
          onRowClick={(row) => handleRowClick(row as Document)}
          searchable={false}
          defaultRowsPerPage={10}
        />
      )}

      {(user?.role === UserRole.ADMIN || user?.role === UserRole.SECRETARY || user?.role === UserRole.BOARD_MEMBER) && (
        <Fab
          color="primary"
          aria-label="upload document"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={handleUploadClick}
        >
          <AddIcon />
        </Fab>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AppLayout>
  );
};
