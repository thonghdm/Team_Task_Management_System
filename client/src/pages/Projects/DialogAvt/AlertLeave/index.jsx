import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    IconButton,
    Box ,
    Button,
    Divider
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const AlertLeave = ({ open, onClose, projectName }) => {
    const theme = useTheme();
   
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'background.default', color: 'text.primary' }}>
                <Typography variant="h6">{projectName}</Typography>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
                <Typography variant="body1">
                If you remove yourself, you'll lose your admin permissions to this project.
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button onClick={onClose} variant="contained"  color="primary" sx={{ mr: 1 }}>
                        Cancel
                    </Button>
                    <Button onClick={() => { console.log('cút'); }} variant="contained" color="error">
                        Leave
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default AlertLeave;