import React from 'react';
import {
    Box, Typography, TextField, Button, Avatar, Chip,
    Dialog, DialogTitle, DialogContent, IconButton
} from '@mui/material';
import {
    Close, CalendarToday, Add
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';


const ActivityLogEntry = ({ avatar, name, action, timestamp }) => {
    const theme = useTheme();
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, color: theme.palette.text.secondary }}>
            <Avatar sx={{ width: 30, height: 30, fontSize: '0.8rem', mr: 1, bgcolor: '#c9b458' }}>
                {avatar}
            </Avatar>
            <Typography variant="body2">
                <span style={{ color: theme.palette.text.primary  }}>{name}</span> {action} • {timestamp}
            </Typography>
        </Box>
    );
}

const ActivityLog = ({ activitys }) => {
    return (
        <Box sx={{ mt: 2 }}>
            {activitys.map((activity, index) => (
                <ActivityLogEntry key={index} {...activity} />
            ))}
        </Box>
    );
};

export default ActivityLog;

