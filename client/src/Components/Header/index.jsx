import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Header = ({ toggleNav }) => (
  <AppBar position="static" sx={{ backgroundColor: 'yellow', color: 'black' }}>
    <Toolbar>
      <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={toggleNav}>
        <MenuIcon />
      </IconButton>
      <Typography variant="h6">appbar</Typography>
    </Toolbar>
  </AppBar>
);
export default Header;