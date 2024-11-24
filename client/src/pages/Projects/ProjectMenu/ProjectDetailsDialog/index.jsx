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

import { useTheme } from '@mui/material';

import ProjectDescription from '~/pages/Projects/Content/Overview/ProjectDescription';
import DueDatePicker from '~/Components/DueDatePicker';
import StatusSelector from '~/pages/Projects/Content/TaskBoard/ChangeList/StatusSelector';

import EditableText from '~/Components/EditableText';


const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    minWidth: 600,
    maxHeight: '80vh',
    boxShadow: theme.shadows[5],
    borderRadius: theme.shape.borderRadius,
  }
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.default,
    '& fieldset': {
      borderColor: theme.palette.divider,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.text.secondary,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    }
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.text.secondary,
  }
}));

const ProjectDetailsDialog = ({ open, onClose, project }) => {
  // const [projectName, setProjectName] = useState('Cross-functional project plan');
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const theme = useTheme();
  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >
      <StyledDialogTitle>
        Project details
        <IconButton onClick={onClose} size="small" sx={{ color: theme.palette.text.secondary }}>
          <CloseIcon />
        </IconButton>
      </StyledDialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Name Section */}
        <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary }}>
          Name
        </Typography>
        <Typography sx={{pb:1, ml:"-4px"}}>
          <EditableText initialText={"projecy"}
            // onSave={handleSaveTitle}
            maxWidth="800px"
            titleColor="primary.main" />
        </Typography>
        {/* <StyledTextField
          fullWidth
          value={project?.name}
          onChange={(e) => setProjectName(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ mb: 3 }}
        /> */}

        {/* Owner & Due Date Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, color: theme.palette.text.secondary }}>
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

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, color: theme.palette.text.secondary, mr: "88px" }}>
              Status
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* <CalendarIcon fontSize="small" sx={{ color: theme.palette.text.secondary }} /> */}
              <StatusSelector
                value={"In Progress"}
                title={""}
              // onChange={handleSaveStatus}
              />
              {/* <Typography>{project?.dueDate || 'No due date'}</Typography> */}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, color: theme.palette.text.secondary, mr: "68px" }}>
              Due date
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* <CalendarIcon fontSize="small" sx={{ color: theme.palette.text.secondary }} /> */}
              <DueDatePicker
                lableDate=""
                // onDateChange={handleSaveDueDate}
                initialDate={"2024-11-20T10:42:43.189+00:00"}
              />
              {/* <Typography>{project?.dueDate || 'No due date'}</Typography> */}
            </Box>
          </Box>
        </Box>

        {/* Project Description Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, color: theme.palette.text.secondary }}>
              Project description
            </Typography>

            {/* <Button
              startIcon={<LightbulbIcon />}
              size="small"
              sx={{ color: 'grey.400' }}
            >
              Show examples
            </Button> */}
          </Box>
          {/* <StyledTextField
            fullWidth
            multiline
            rows={4}
            placeholder="What's this project about?"
            variant="outlined"
          /> */}
          <ProjectDescription initialContent={"thong day"} context={"descriptionProject"} />

        </Box>
        {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            sx={{
              mr: 1,
              color: theme.palette.text.primary,
              borderColor: theme.palette.divider,
            }}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            Update
          </Button>
        </Box> */}
        {/* Connected Portfolios Section */}
        {/* <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, color: 'grey.400' }}>
            Connected portfolios
          </Typography>
          <Typography variant="body2" sx={{ color: 'grey.500' }}>
            This project is not in any portfolios yet
          </Typography>
        </Box> */}
      </DialogContent>
    </StyledDialog >
  );
};

export default ProjectDetailsDialog;