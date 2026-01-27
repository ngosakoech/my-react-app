import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  InputAdornment,
  Button,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Search as SearchIcon,
  Upload as UploadIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  Folder as FolderIcon,
} from '@mui/icons-material';
import { DataTable, type Column } from '../../components/common/DataTable';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { mockDocuments } from '../../mocks/documents.mock';
import type { Document } from '../../types';
import { DocumentCategory } from '../../types';
import { format } from 'date-fns';

export const DocumentLibrary = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    const loadDocuments = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setDocuments(mockDocuments);
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, []);

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory =
      categoryFilter === 'all' || doc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const columns: Column<Document>[] = [
    {
      id: 'title',
      label: 'Document',
      minWidth: 300,
      format: (_, row) => (
        <Box>
          <Typography variant="subtitle2">{row.title}</Typography>
          <Typography variant="caption" color="text.secondary">
            {row.description || 'No description'}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'category',
      label: 'Category',
      align: 'center',
      format: (value) => (
        <Chip
          label={value as string}
          size="small"
          color={
            value === DocumentCategory.FINANCIAL
              ? 'primary'
              : value === DocumentCategory.POLICY
              ? 'secondary'
              : 'default'
          }
        />
      ),
    },
    {
      id: 'type',
      label: 'Type',
      align: 'center',
    },
    {
      id: 'size',
      label: 'Size',
      align: 'right',
      format: (value) => {
        const sizeInKB = (value as number) / 1024;
        return sizeInKB > 1024
          ? `${(sizeInKB / 1024).toFixed(2)} MB`
          : `${sizeInKB.toFixed(2)} KB`;
      },
    },
    {
      id: 'uploadedBy',
      label: 'Uploaded By',
      minWidth: 120,
    },
    {
      id: 'uploadedDate',
      label: 'Date',
      minWidth: 120,
      format: (value) => format(new Date(value as Date), 'PP'),
    },
    {
      id: 'isConfidential',
      label: 'Access',
      align: 'center',
      format: (value) =>
        value ? (
          <Chip label="Confidential" size="small" color="error" />
        ) : (
          <Chip label="Public" size="small" color="success" />
        ),
    },
    {
      id: 'id',
      label: 'Actions',
      align: 'center',
      sortable: false,
      format: (_, row) => (
        <Box>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/documents/${row.id}`);
            }}
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <DownloadIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const stats = [
    {
      label: 'Total Documents',
      value: documents.length,
      color: 'primary.main',
    },
    {
      label: 'Categories',
      value: new Set(documents.map((d) => d.category)).size,
      color: 'info.main',
    },
    {
      label: 'Confidential',
      value: documents.filter((d) => d.isConfidential).length,
      color: 'error.main',
    },
    {
      label: 'Total Size',
      value: `${(
        documents.reduce((sum, d) => sum + d.size, 0) /
        (1024 * 1024)
      ).toFixed(1)} MB`,
      color: 'success.main',
    },
  ];

  if (loading) {
    return <LoadingSpinner message="Loading documents..." />;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Document Library
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Browse and manage all organizational documents
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<UploadIcon />}>
          Upload Document
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {stats.map((stat, index) => (
          <Grid xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h4" sx={{ color: stat.color, mb: 1 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <MenuItem value="all">All Categories</MenuItem>
                {Object.values(DocumentCategory).map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {filteredDocuments.length === 0 ? (
        <EmptyState
          icon={FolderIcon}
          title="No documents found"
          description="Try adjusting your search or upload a new document"
          action={
            <Button variant="contained" startIcon={<UploadIcon />}>
              Upload Document
            </Button>
          }
        />
      ) : (
        <DataTable
          columns={columns}
          rows={filteredDocuments}
          rowKey="id"
          onRowClick={(doc) => navigate(`/documents/${doc.id}`)}
        />
      )}
    </Box>
  );
};
