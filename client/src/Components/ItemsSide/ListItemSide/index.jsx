import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const ListItemSide = ({ iconName, titlePlan, toggleNav }) => {
    const IconComponent = iconName === 'chevronLeft' ? ChevronLeftIcon : ArrowForwardIosIcon;

    return (
        <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="body1">{titlePlan}</Typography>
            <IconButton onClick={toggleNav}>
                <IconComponent />
            </IconButton>
        </Box>
    );
};

export default ListItemSide;
