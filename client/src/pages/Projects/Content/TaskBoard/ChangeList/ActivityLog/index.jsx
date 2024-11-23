import React from 'react';
import {
    Box, Typography, TextField, Button, Avatar, Chip,
    Dialog, DialogTitle, DialogContent, IconButton
} from '@mui/material';
import {
    Close, CalendarToday, Add
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';


const ActivityLogEntry = ({ avatar, name, action, entity, timestamp, old_value, new_value }) => {
    const theme = useTheme();
    const updateDetails = action === 'Update' && old_value && new_value && old_value !== new_value && entity !== 'Description' && entity !== 'Comment';
    const addMemberDetails = action === 'Add' && entity === 'Member' && old_value;
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, color: theme.palette.text.secondary }}>
            <Avatar src={avatar} sx={{ width: 30, height: 30, fontSize: '0.8rem', mr: 1, bgcolor: '#c9b458' }}>
            </Avatar>
            <Typography variant="body2">
                <span style={{ color: theme.palette.text.primary }}>{name}</span> {action} {entity}
                {updateDetails ? (
                    <>
                        <span> </span>
                        from <Chip label={old_value} color="primary" size="small" /> to <Chip label={new_value} color="primary" size="small" sx={{ marginLeft: '3px' }}/>
                    </>
                ) : addMemberDetails ? (
                    <>
                        {old_value.split(',').map((userInvite, index) => (
                            <Chip key={index} label={userInvite.trim()} color="primary" size="small" sx={{ marginRight: '8px' }} />
                        ))}
                    </>)
                :(
                    old_value && entity !=='Description' && entity !=='Comment' &&<Chip label={old_value} color="primary" size="small" sx={{ marginLeft: '8px' }}/>
                )}
                <span style={{ marginLeft: '8px' }}>• {timestamp}</span>
            </Typography>
        </Box>
    );
}

const ActivityLog = ({ activitys }) => {
    return (
        <Box sx={{ mt: 2 }}>
            {[...activitys]?.reverse().map((activity, index) => (
                <ActivityLogEntry
                 key={index}
                    avatar={activity?.user_id?.image}
                    name={activity?.user_id?.displayName}
                    action={activity?.action}
                    entity={activity?.entity}
                    old_value={activity?.old_value||''}
                    new_value={activity?.new_value||''}
                    timestamp={new Date(activity?.createdAt).toLocaleString()}
                 />
            ))}
        </Box>
    );
};

export default ActivityLog;

