import * as React from 'react';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';
import DialogButtonAdd from './DialogButtonAdd';

export default function ButtonAdd() {
    const theme = useTheme();

    //dialog add
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    // 
    return (
        <>
            <Button
                type="button"
                variant="outlined"
                startIcon={<AddIcon />}
                sx={{
                    position: 'fixed',
                    bottom: 31, 
                    left: 280, 
                    zIndex: 1000,
                    bgcolor: theme.palette.text.disabled,
                    color: theme.palette.text.primary,
                    '&:hover': {
                       bgcolor: theme.palette.text.disabled,
                    },                    
                }}
                onClick={handleClickOpen}
            >
                Add
            </Button>

            <DialogButtonAdd open={open} onClose={handleClose} />
        </>
    );
}