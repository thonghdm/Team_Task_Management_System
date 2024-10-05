import React, { useState } from 'react';
import { Paper, IconButton, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

const SearchWithFilters = ({ width }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Paper
      component="form"
      sx={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#424242',
        width: width,
        minWidth: '200px', // Đảm bảo thanh tìm kiếm không quá nhỏ
        maxWidth: '500px', // Giới hạn kích thước tối đa
        borderRadius: '24px',
        transition: 'width 0.3s', // Thêm hiệu ứng chuyển đổi mượt mà
      }}
    >
      <IconButton sx={{ p: '10px', color: '#9e9e9e' }} aria-label="search">
        <SearchIcon />
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1, color: '#fff' }}
        placeholder="Search"
        value={searchTerm}
        onChange={handleSearchChange}
        inputProps={{ 'aria-label': 'search' }}
      />
      <IconButton sx={{ p: '10px', color: '#9e9e9e' }} aria-label="filter">
        <FilterListIcon />
      </IconButton>
    </Paper>
  );
};

export default SearchWithFilters;