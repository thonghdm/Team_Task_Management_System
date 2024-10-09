import React, { useState } from 'react';
import { Button, Menu, MenuItem, IconButton, Typography, Box } from '@mui/material';
import { ArrowLeft, ArrowRight } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const CustomCalendar = ({ label, onView, onNavigate, views }) => {
    const [itemText, setItemText] = useState('month');
    const [anchorEl, setAnchorEl] = useState(null);
    const theme = useTheme();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (view) => {
        if (view) {
            onView(view);
            setItemText(view);
        }
        setAnchorEl(null);
    };

    return (
        <Box display="flex" alignItems="center" justifyContent="space-between" padding={2} className="toolbar-container">
            <Typography sx={{color:theme.palette.text.primary}} variant="h5" className="mesAno">{label}</Typography>
            
            <Box display="flex" alignItems="center" className="dirtop">
                {/* Dropdown for views */}
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleClick}
                >
                    {itemText}
                </Button>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => handleClose(null)}
                >
                    {views.map((view, index) => (
                        <div key={index}>
                            <MenuItem onClick={() => handleClose(view)}>
                                {view}
                            </MenuItem>
                            {index === 2 && <hr style={{ width: '100%', borderTop: '1px solid #ddd' }} />}
                        </div>
                    ))}
                </Menu>

                {/* Navigation buttons */}
                <Box ml={2} className="toolbar-navegation">
                    <Button 
                        variant="contained" 
                        color="secondary" 
                        onClick={() => onNavigate('TODAY')}
                    >
                        Hoje
                    </Button>
                    <IconButton 
                        onClick={() => onNavigate('PREV')} 
                        color="secondary"
                        style={{ marginLeft: '15px' }}
                    >
                        <ArrowLeft />
                    </IconButton>
                    <IconButton 
                        onClick={() => onNavigate('NEXT')} 
                        color="secondary"
                    >
                        <ArrowRight />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
};

export default CustomCalendar;
