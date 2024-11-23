// Boards.js
import React, { useState } from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import Content from './Content';
import Footer from './Footer';


const Boards = () => {
    const [open, setOpen] = useState(true);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    return (
        <Box>
            <Header />
            <Content />
            <Footer />
        </Box>
    );
};

export default Boards;