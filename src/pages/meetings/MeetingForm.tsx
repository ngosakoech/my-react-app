import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  MenuItem,
  IconButton,
  Divider,
  Alert,
  Breadcrumbs,
  Link,
  Autocomplete,
  Chip,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  ArrowBack as ArrowBackIcon,
  DragIndicator as DragIcon
} from '@mui/icons-material';
import { AppLayout } from '../../components/layout/AppLayout';
import { FileUploader } from '../../components/common/FileUploader';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useMeetingContext } from '../../contexts/MeetingContext';
import { MeetingType, MeetingStatus } from '../../types/meeting.types';
import { format } from 'date-fns';

const agendaItemSchema = z.object({
  id: z.string().optional(),
  order: z.number(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  presenter: z.string().min(1, 'Presenter is required'),
  duration: z.number().min(1, 'Duration must be at least 1 minute'),
  documents: z.array(z.string()).optional(),
  notes: z.string().optional(),
  isCompleted: z.boolean().optional()
});

const meetingFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  location: z.string().min(1, 'Location is required'),
  type: z.enum(['board', 'subcommittee', 'emergency', 'annual', 'special']),
  status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled']),
  attendees: z.array(z.string()).min(1, 'At least one attendee is required'),
  agenda: z.array(agendaItemSchema),
  documents: z.array(z.string()).optional()
});

type MeetingFormData = z.infer<typeof meetingFormSchema>;

const meetingTypeOptions = [
  { value: MeetingType.BOARD, label: 'Board Meeting' },
  { value: MeetingType.SUBCOMMITTEE, label: 'Subcommittee' },
  { value: MeetingType.EMERGENCY, label: 'Emergency' },
  { value: MeetingType.ANNUAL, label: 'Annual' },
  { value: MeetingType.SPECIAL, label: 'Special' }
];

const meetingStatusOptions = [
  { value: MeetingStatus.SCHEDULED, label: 'Scheduled' },
  { value: MeetingStatus.IN_PROGRESS, label: 'In Progress' },
  { value: MeetingStatus.COMPLETED, label: 'Completed' },
  { value: MeetingStatus.CANCELLED, label: 'Cancelled' }
];

const mockAttendees = [
  'John Smith',
  'Sarah Johnson',
  'Michael Brown',
  'Emily Davis',
  'David Wilson',
  'Lisa Anderson',
  'Robert Taylor',
  'Jennifer Martinez'
];

export const MeetingForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedMeeting, loading, error, getMeeting, createMeeting, updateMeeting } = useMeetingContext();
  
  const [uploadedDocuments, setUploadedDocuments] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = Boolean(id);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<MeetingFormData>({
    resolver: zodResolver(meetingFormSchema),
    defaultValues: {
      title: '',
      description: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '10:00',
      location: '',
      type: MeetingType.BOARD,
      status: MeetingStatus.SCHEDULED,
      attendees: [],
      agenda: [],
      documents: []
    }
  });

  const { fields: agendaFields, append: appendAgenda, remove: removeAgenda } = useFieldArray({
    control,
    name: 'agenda'
  });

  useEffect(() => {
    if (isEditMode && id) {
      getMeeting(id);
    }
  }, [id, isEditMode, getMeeting]);

  useEffect(() => {
    if (isEditMode && selectedMeeting) {
      reset({
        title: selectedMeeting.title,
        description: '',
        date: format(new Date(selectedMeeting.date), 'yyyy-MM-dd'),
        time: selectedMeeting.time,
        location: selectedMeeting.location,
        type: selectedMeeting.type,
        status: selectedMeeting.status,
        attendees: selectedMeeting.attendees,
        agenda: selectedMeeting.agenda.map(item => ({
          ...item,
          duration: item.duration
        })),
        documents: selectedMeeting.documents
      });
      setUploadedDocuments(selectedMeeting.documents);
    }
  }, [isEditMode, selectedMeeting, reset]);

  const handleAddAgendaItem = () => {
    appendAgenda({
      order: agendaFields.length + 1,
      title: '',
      description: '',
      presenter: '',
      duration: 15,
      documents: [],
      notes: '',
      isCompleted: false
    });
  };

  const handleFilesSelected = (files: File[]) => {
    const fileNames = files.map(file => file.name);
    setUploadedDocuments(prev => [...prev, ...fileNames]);
  };

  const handleRemoveDocument = (index: number) => {
    setUploadedDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: MeetingFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const meetingData = {
        ...data,
        date: new Date(data.date),
        documents: uploadedDocuments,
        agenda: data.agenda.map((item, index) => ({
          ...item,
          order: index + 1,
          id: item.id || `agenda-${Date.now()}-${index}`,
          description: item.description || '',
          notes: item.notes || ''
        }))
      };

      if (isEditMode && id) {
        await updateMeeting(id, meetingData);
      } else {
        await createMeeting(meetingData);
      }

      navigate('/meetings');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to save meeting');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/meetings');
  };

  if (loading && isEditMode) {
    return (
      <AppLayout>
        <LoadingSpinner />
      </AppLayout>
    );
  }

  if (error && isEditMode) {
    return (
      <AppLayout>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/meetings')}>
          Back to Meetings
        </Button>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link
            component="button"
            variant="body1"
            onClick={() => navigate('/meetings')}
            sx={{ textDecoration: 'none', cursor: 'pointer' }}
          >
            Meetings
          </Link>
          <Typography color="text.primary">
            {isEditMode ? 'Edit Meeting' : 'Create Meeting'}
          </Typography>
        </Breadcrumbs>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            {isEditMode ? 'Edit Meeting' : 'Create New Meeting'}
          </Typography>
          <IconButton onClick={handleCancel}>
            <ArrowBackIcon />
          </IconButton>
        </Box>

        {submitError && (
          <Alert severity="error" onClose={() => setSubmitError(null)} sx={{ mb: 3 }}>
            {submitError}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
            <Box>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Basic Information
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Meeting Title"
                        required
                        error={!!errors.title}
                        helperText={errors.title?.message}
                      />
                    )}
                  />

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                    <Controller
                      name="type"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          select
                          label="Meeting Type"
                          required
                          error={!!errors.type}
                          helperText={errors.type?.message}
                        >
                          {meetingTypeOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />

                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          select
                          label="Status"
                          required
                          error={!!errors.status}
                          helperText={errors.status?.message}
                        >
                          {meetingStatusOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Box>

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                    <Controller
                      name="date"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          type="date"
                          label="Date"
                          required
                          InputLabelProps={{ shrink: true }}
                          error={!!errors.date}
                          helperText={errors.date?.message}
                        />
                      )}
                    />

                    <Controller
                      name="time"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          type="time"
                          label="Time"
                          required
                          InputLabelProps={{ shrink: true }}
                          error={!!errors.time}
                          helperText={errors.time?.message}
                        />
                      )}
                    />
                  </Box>

                  <Controller
                    name="location"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Location"
                        required
                        error={!!errors.location}
                        helperText={errors.location?.message}
                        placeholder="e.g., Conference Room A, Virtual Meeting, etc."
                      />
                    )}
                  />

                  <Controller
                    name="attendees"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        multiple
                        options={mockAttendees}
                        value={field.value || []}
                        onChange={(_, value) => field.onChange(value)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Attendees"
                            required
                            error={!!errors.attendees}
                            helperText={errors.attendees?.message || 'Select meeting attendees'}
                          />
                        )}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip
                              label={option}
                              {...getTagProps({ index })}
                              key={option}
                            />
                          ))
                        }
                      />
                    )}
                  />
                </Box>
              </Paper>

              <Paper sx={{ p: 3, mb: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">
                    Agenda Items
                  </Typography>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={handleAddAgendaItem}
                    variant="outlined"
                    size="small"
                  >
                    Add Item
                  </Button>
                </Box>
                <Divider sx={{ mb: 3 }} />

                {agendaFields.length === 0 ? (
                  <Alert severity="info">
                    No agenda items yet. Click "Add Item" to create one.
                  </Alert>
                ) : (
                  <Box>
                    {agendaFields.map((field, index) => (
                      <Card key={field.id} variant="outlined" sx={{ mb: 2 }}>
                        <CardContent>
                          <Box display="flex" alignItems="flex-start" gap={1} mb={2}>
                            <IconButton size="small" disabled>
                              <DragIcon />
                            </IconButton>
                            <Typography variant="subtitle2" sx={{ mt: 1 }}>
                              Item {index + 1}
                            </Typography>
                            <Box flex={1} />
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => removeAgenda(index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>

                          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
                            <Controller
                              name={`agenda.${index}.title`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  fullWidth
                                  label="Title"
                                  required
                                  size="small"
                                  error={!!errors.agenda?.[index]?.title}
                                  helperText={errors.agenda?.[index]?.title?.message}
                                />
                              )}
                            />

                            <Controller
                              name={`agenda.${index}.description`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  fullWidth
                                  label="Description"
                                  multiline
                                  rows={2}
                                  size="small"
                                />
                              )}
                            />

                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                              <Controller
                                name={`agenda.${index}.presenter`}
                                control={control}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    fullWidth
                                    label="Presenter"
                                    required
                                    size="small"
                                    error={!!errors.agenda?.[index]?.presenter}
                                    helperText={errors.agenda?.[index]?.presenter?.message}
                                  />
                                )}
                              />

                              <Controller
                                name={`agenda.${index}.duration`}
                                control={control}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    fullWidth
                                    type="number"
                                    label="Duration (minutes)"
                                    required
                                    size="small"
                                    inputProps={{ min: 1 }}
                                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                                    error={!!errors.agenda?.[index]?.duration}
                                    helperText={errors.agenda?.[index]?.duration?.message}
                                  />
                                )}
                              />
                            </Box>

                            <Controller
                              name={`agenda.${index}.notes`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  fullWidth
                                  label="Notes"
                                  multiline
                                  rows={2}
                                  size="small"
                                />
                              )}
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}
              </Paper>

              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Documents
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <FileUploader
                  onFilesSelected={handleFilesSelected}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                  multiple
                  maxSize={10}
                  maxFiles={10}
                />

                {uploadedDocuments.length > 0 && (
                  <List sx={{ mt: 2 }}>
                    {uploadedDocuments.map((doc, index) => (
                      <ListItem key={index} divider>
                        <ListItemText primary={doc} />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            onClick={() => handleRemoveDocument(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Paper>
            </Box>

            <Box>
              <Paper sx={{ p: 3, position: 'sticky', top: 80 }}>
                <Typography variant="h6" gutterBottom>
                  Actions
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Box display="flex" flexDirection="column" gap={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    startIcon={<SaveIcon />}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : isEditMode ? 'Update Meeting' : 'Create Meeting'}
                  </Button>

                  <Button
                    variant="outlined"
                    size="large"
                    fullWidth
                    startIcon={<CancelIcon />}
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Typography variant="subtitle2" gutterBottom>
                  Summary
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Agenda Items: <strong>{agendaFields.length}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Attendees: <strong>{watch('attendees')?.length || 0}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Documents: <strong>{uploadedDocuments.length}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Duration:{' '}
                    <strong>
                      {agendaFields.reduce((sum, item) => sum + (item.duration || 0), 0)} min
                    </strong>
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Box>
        </form>
      </Box>
    </AppLayout>
  );
};
