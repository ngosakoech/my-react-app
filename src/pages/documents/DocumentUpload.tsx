import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  Stack,
  Alert,
  Chip,
  FormControlLabel,
  Checkbox,
  LinearProgress,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { AppLayout } from '../../components/layout/AppLayout';
import { FileUploader } from '../../components/common/FileUploader';
import { useDocumentContext } from '../../contexts/DocumentContext';
import { DocumentCategory } from '../../types/document.types';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
];

const ACCEPTED_EXTENSIONS = '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png';

const documentSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
  category: z.nativeEnum(DocumentCategory).refine((val) => !!val, 'Please select a category'),
  tags: z.string().optional(),
  isConfidential: z.boolean(),
});

type DocumentFormData = z.infer<typeof documentSchema>;

export const DocumentUpload = () => {
  const navigate = useNavigate();
  const { uploadDocument, loading, error } = useDocumentContext();
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedDocId, setUploadedDocId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      title: '',
      description: '',
      category: DocumentCategory.OTHER,
      tags: '',
      isConfidential: false,
    },
  });

  const handleFilesSelected = (selectedFiles: File[]) => {
    // Validate file types
    const invalidFiles = selectedFiles.filter(
      (file) => !ACCEPTED_FILE_TYPES.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      setUploadError(
        `Invalid file type(s): ${invalidFiles.map((f) => f.name).join(', ')}. Please upload PDF, DOC, DOCX, XLS, XLSX, JPG, or PNG files.`
      );
      return;
    }

    // Validate file size
    const oversizedFiles = selectedFiles.filter((file) => file.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      setUploadError(
        `File(s) too large: ${oversizedFiles.map((f) => f.name).join(', ')}. Maximum size is 10MB per file.`
      );
      return;
    }

    setUploadError(null);
    setFiles(selectedFiles);
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleTagDelete = (tagToDelete: string) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  const onSubmit = async (data: DocumentFormData) => {
    if (files.length === 0) {
      setUploadError('Please select at least one file to upload');
      return;
    }

    setUploadError(null);
    setUploadProgress(0);

    try {
      const file = files[0];
      if (!file) {
        setUploadError('No file selected');
        return;
      }

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const uploadedDoc = await uploadDocument({
        title: data.title,
        description: data.description,
        category: data.category,
        type: file.type,
        file: file,
        tags: tags,
        isConfidential: data.isConfidential,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadedDocId(uploadedDoc.id);

      // Reset form
      setTimeout(() => {
        reset();
        setFiles([]);
        setTags([]);
        setUploadProgress(0);
      }, 2000);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to upload document';
      setUploadError(message);
      setUploadProgress(0);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      navigate('/documents');
    }
  };

  return (
    <AppLayout>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Upload Document
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Add a new document to the library
        </Typography>
      </Box>

      {uploadedDocId && (
        <Alert
          severity="success"
          icon={<CheckCircleIcon />}
          sx={{ mb: 3 }}
          action={
            <Button
              component={RouterLink}
              to={`/documents/${uploadedDocId}`}
              color="inherit"
              size="small"
            >
              View Document
            </Button>
          }
        >
          Document uploaded successfully!
        </Alert>
      )}

      {(error || uploadError) && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setUploadError(null)}>
          {error || uploadError}
        </Alert>
      )}

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Document Title"
                    required
                    fullWidth
                    error={!!errors.title}
                    helperText={errors.title?.message}
                    placeholder="Enter document title"
                  />
                )}
              />

              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description"
                    fullWidth
                    multiline
                    rows={3}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    placeholder="Brief description of the document (optional)"
                  />
                )}
              />

              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Category"
                    required
                    fullWidth
                    error={!!errors.category}
                    helperText={errors.category?.message}
                  >
                    {Object.values(DocumentCategory).map((category) => (
                      <MenuItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              <Box>
                <TextField
                  label="Tags"
                  fullWidth
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  placeholder="Type and press Enter to add tags"
                  helperText="Press Enter to add each tag"
                />
                {tags.length > 0 && (
                  <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ mt: 1 }}>
                    {tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        onDelete={() => handleTagDelete(tag)}
                        size="small"
                        sx={{ mb: 0.5 }}
                      />
                    ))}
                  </Stack>
                )}
              </Box>

              <Controller
                name="isConfidential"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...field}
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    }
                    label="Mark as Confidential"
                  />
                )}
              />

              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Upload File
                </Typography>
                <FileUploader
                  onFilesSelected={handleFilesSelected}
                  accept={ACCEPTED_EXTENSIONS}
                  multiple={false}
                  maxSize={10}
                  maxFiles={1}
                  disabled={loading}
                />
                {files.length > 0 && files[0] && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Selected file: {files[0].name} ({(files[0].size / 1024 / 1024).toFixed(2)} MB)
                  </Alert>
                )}
              </Box>

              {uploadProgress > 0 && uploadProgress < 100 && (
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Uploading... {uploadProgress}%
                  </Typography>
                  <LinearProgress variant="determinate" value={uploadProgress} />
                </Box>
              )}

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  disabled={loading}
                  startIcon={<CancelIcon />}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading || files.length === 0}
                  startIcon={<CloudUploadIcon />}
                >
                  {loading ? 'Uploading...' : 'Upload Document'}
                </Button>
              </Stack>
            </Stack>
          </form>
        </CardContent>
      </Card>

      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Supported file types:</strong> PDF, DOC, DOCX, XLS, XLSX, JPG, PNG
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Maximum file size:</strong> 10 MB per file
        </Typography>
      </Box>
    </AppLayout>
  );
};
