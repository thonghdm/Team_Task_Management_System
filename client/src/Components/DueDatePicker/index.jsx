import React, { useState, useEffect } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { CalendarToday, HighlightOff } from '@mui/icons-material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import dayjs from 'dayjs';
import { useTheme } from '@mui/material/styles';

const DueDatePicker = ({ 
    lableDate, 
    onDateChange, 
    initialDate = null  // Add an optional initialDate prop
}) => {
    const theme = useTheme();
    const [date, setDate] = useState(() => {
        // Use the initialDate if provided, otherwise use current date
        return initialDate ? dayjs(initialDate) : dayjs();
    });
    const [open, setOpen] = useState(false);

    // Add useEffect to update state if initialDate changes
    useEffect(() => {
        if (initialDate) {
            setDate(dayjs(initialDate));
        }
    }, [initialDate]);

    const handleDateChange = (newDate) => {
        // Use the provided newDate or fall back to initial value
        const finalDate = newDate || date;
        setDate(finalDate);
        
        // Convert to ISO 8601 format before sending to the parent component
        const isoDate = finalDate ? finalDate.toISOString() : null;
        onDateChange(isoDate);
        setOpen(false);
    };

    const handleChipClick = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // Optional delete handler
    const handleDelete = () => {
        setDate(null);
        onDateChange(null);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent:'space-between' }}>
                <Typography sx={{ width: '100px' }}>{lableDate}</Typography>
                <Chip
                    icon={!date ? <CalendarToday fontSize="small" /> : null}
                    label={date ? dayjs(date).format('MMM DD, hh:mm A') : 'No due date'}
                    onClick={handleChipClick}
                    // onDelete={date ? handleDelete : null}
                    // deleteIcon={<HighlightOff />}
                    sx={{ 
                        bgcolor: 'transparent', 
                        border: `1px solid ${theme.palette.text.secondary}`,
                        '& .MuiChip-deleteIcon': {
                            color: theme.palette.text.secondary
                        }
                    }}
                />

                <DateTimePicker
                    open={open}
                    onClose={handleClose}
                    value={date}
                    onChange={handleDateChange}
                    viewRenderers={{
                        hours: renderTimeViewClock,
                        minutes: renderTimeViewClock,
                        seconds: renderTimeViewClock,
                    }}
                    sx={{ display: 'none' }}
                />
            </Box>
        </LocalizationProvider>
    );
};

export default DueDatePicker;