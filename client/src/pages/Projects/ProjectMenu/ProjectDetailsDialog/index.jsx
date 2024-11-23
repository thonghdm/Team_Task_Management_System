import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  TextField,
  Avatar,
  Box,
  styled,
  Button
} from '@mui/material';
import {
  Close as CloseIcon,
  CalendarToday as CalendarIcon,
  LightbulbOutlined as LightbulbIcon
} from '@mui/icons-material';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: theme.palette.grey[900],
    color: theme.palette.common.white,
    minWidth: 600,
    maxHeight: '80vh'
  }
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.grey[800]}`
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.grey[800],
    '& fieldset': {
      borderColor: 'transparent'
    },
    '&:hover fieldset': {
      borderColor: theme.palette.grey[700]
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main
    }
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.grey[500]
  }
}));

const ProjectDetailsDialog = ({ open, onClose }) => {
  const [projectName, setProjectName] = useState('Cross-functional project plan');

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >
      <StyledDialogTitle>
        Project details
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ color: 'grey.500' }}
        >
          <CloseIcon />
        </IconButton>
      </StyledDialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Name Section */}
        <Typography variant="subtitle2" sx={{ mb: 1, color: 'grey.400' }}>
          Name
        </Typography>
        <StyledTextField
          fullWidth
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ mb: 3 }}
        />

        {/* Owner & Due Date Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, color: 'grey.400' }}>
              Owner
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: 'primary.main',
                  fontSize: '0.875rem'
                }}
              >
                GH
              </Avatar>
              <Typography>Gia Huy Hồ</Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, color: 'grey.400' }}>
              Due date
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'grey.400' }}>
              <CalendarIcon fontSize="small" />
              <Typography>No due date</Typography>
            </Box>
          </Box>
        </Box>

        {/* Project Description Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography variant="subtitle2" sx={{ color: 'grey.400' }}>
              Project description
            </Typography>
            <Button
              startIcon={<LightbulbIcon />}
              size="small"
              sx={{ color: 'grey.400' }}
            >
              Show examples
            </Button>
          </Box>
          <StyledTextField
            fullWidth
            multiline
            rows={4}
            placeholder="What's this project about?"
            variant="outlined"
          />
        </Box>

        {/* Connected Portfolios Section */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, color: 'grey.400' }}>
            Connected portfolios
          </Typography>
          <Typography variant="body2" sx={{ color: 'grey.500' }}>
            This project is not in any portfolios yet
          </Typography>
        </Box>
      </DialogContent>
    </StyledDialog>
  );
};

export default ProjectDetailsDialog;