import React, { useState } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { CalendarToday, HighlightOff } from '@mui/icons-material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import dayjs from 'dayjs';
import { useTheme } from '@mui/material/styles';

const DueDatePicker = ({ lableDate, onDateChange }) => {
    const theme = useTheme();
    const [date, setDate] = useState(dayjs());
    const [open, setOpen] = useState(false);

    const handleDateChange = (newDate) => {
        setDate(newDate);
        // Convert to ISO 8601 format before sending to the parent component
        const isoDate = newDate ? newDate.toISOString() : dayjs();
        onDateChange(isoDate); // Gọi callback để trả về giá trị ngày dạng ISO 8601
        setOpen(false);
    };

    const handleChipClick = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // const handleDelete = () => {
    //     setDate(dayjs());
    //     onDateChange(null); // Trả về null khi xóa ngày
    // };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent:'space-between' }}>
                <Typography sx={{ width: '100px' }}>{lableDate}</Typography>
                <Chip
                    icon={date ? null : <CalendarToday fontSize="small" />}
                    label={date ? dayjs(date).format('MMM DD, hh:mm A') : 'No due date'}
                    onClick={handleChipClick}
                    // onDelete={date ? handleDelete : null}
                    deleteIcon={<HighlightOff />}
                    sx={{ bgcolor: 'transparent', border: `1px solid  ${theme.palette.text.secondary}` }}
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
