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

const AlertLeave = ({ open, onClose, projectName, lable, onConfirm }) => {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'background.default', color: 'text.primary' }}>
                <Typography variant="h6">{projectName}</Typography>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
                <Typography variant="body1" sx={{ pt: 2 }}>
                    {lable}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button onClick={onClose} variant="contained" color="primary" sx={{ mr: 1 }}>
                        Cancel
                    </Button>
                    <Button onClick={onConfirm} variant="contained" color="error"> {/* Call confirm on click */}
                        OK
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default AlertLeave;