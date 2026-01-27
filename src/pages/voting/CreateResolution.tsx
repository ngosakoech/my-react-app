import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Divider,
} from '@mui/material';
import {
  Save as SaveIcon,
  Publish as PublishIcon,
} from '@mui/icons-material';
import { VotingRule } from '../../types';

const resolutionSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  votingRule: z.nativeEnum(VotingRule),
  isAnonymous: z.boolean(),
  category: z.string().min(1, 'Category is required'),
  votingDeadline: z.string().min(1, 'Voting deadline is required'),
  relatedMeetingId: z.string().optional(),
});

type ResolutionFormData = z.infer<typeof resolutionSchema>;

export const CreateResolution = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResolutionFormData>({
    resolver: zodResolver(resolutionSchema),
    defaultValues: {
      title: '',
      description: '',
      votingRule: VotingRule.SIMPLE_MAJORITY,
      isAnonymous: false,
      category: '',
      votingDeadline: '',
      relatedMeetingId: '',
    },
  });

  const onSubmit = async (data: ResolutionFormData, publish: boolean = false) => {
    setSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Resolution saved:', { ...data, status: publish ? 'active' : 'draft' });
      navigate('/voting');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Create Resolution
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Draft a new resolution for board voting
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <form>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12 }}>
                    <Controller
                      name="title"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Resolution Title"
                          placeholder="Enter a clear and concise title"
                          error={!!errors.title}
                          helperText={errors.title?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          multiline
                          rows={6}
                          label="Description"
                          placeholder="Provide detailed information about the resolution"
                          error={!!errors.description}
                          helperText={errors.description?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Controller
                      name="category"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          select
                          label="Category"
                          error={!!errors.category}
                          helperText={errors.category?.message}
                        >
                          <MenuItem value="policy">Policy</MenuItem>
                          <MenuItem value="financial">Financial</MenuItem>
                          <MenuItem value="operational">Operational</MenuItem>
                          <MenuItem value="strategic">Strategic</MenuItem>
                          <MenuItem value="governance">Governance</MenuItem>
                          <MenuItem value="other">Other</MenuItem>
                        </TextField>
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Controller
                      name="votingRule"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          select
                          label="Voting Rule"
                          error={!!errors.votingRule}
                          helperText={errors.votingRule?.message}
                        >
                          {Object.values(VotingRule).map((rule) => (
                            <MenuItem key={rule} value={rule}>
                              {rule.replace('_', ' ')}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Controller
                      name="votingDeadline"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          type="datetime-local"
                          label="Voting Deadline"
                          InputLabelProps={{ shrink: true }}
                          error={!!errors.votingDeadline}
                          helperText={errors.votingDeadline?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Controller
                      name="relatedMeetingId"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Related Meeting (Optional)"
                          placeholder="Enter meeting ID"
                        />
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <Controller
                      name="isAnonymous"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...field}
                              checked={field.value}
                            />
                          }
                          label="Anonymous Voting (hide voter identities)"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Actions
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<PublishIcon />}
                  onClick={handleSubmit((data) => onSubmit(data, true))}
                  disabled={saving}
                >
                  {saving ? 'Publishing...' : 'Publish Resolution'}
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<SaveIcon />}
                  onClick={handleSubmit((data) => onSubmit(data, false))}
                  disabled={saving}
                >
                  Save as Draft
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate('/voting')}
                  disabled={saving}
                >
                  Cancel
                </Button>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Voting Rules
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2">Simple Majority</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Requires more than 50% yes votes
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">Two-Thirds</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Requires at least 66.67% yes votes
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">Unanimous</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Requires 100% yes votes
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">Quorum Only</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Requires minimum participation threshold
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
