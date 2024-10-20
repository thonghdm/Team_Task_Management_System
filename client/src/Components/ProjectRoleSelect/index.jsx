import React from 'react';
import { Select, MenuItem, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { useTheme } from '@mui/material/styles';

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
    color: theme.palette.text.primary,
    '&:hover': {
        backgroundColor: theme.palette.mode === 'light'
            ? theme.palette.grey[50]
            : theme.palette.grey[500],
    },
    '&.Mui-selected': {
        backgroundColor: theme.palette.mode === 'light'
            ? theme.palette.grey[300]
            : theme.palette.grey[600],
        '&:hover': {
            backgroundColor: theme.palette.mode === 'light'
                ? theme.palette.grey[300]
                : theme.palette.grey[500],
        },
    },
}));

const RoleSelect = ({ value, onChange,DB,fullWidth }) => {
    const theme = useTheme();

    return (
        <Select
            value={value}
            onChange={onChange}
            size="small"
            fullWidth={fullWidth || false}  // Sử dụng thuộc tính fullWidth khi cần
            sx={{ minWidth: 100, mr: 1 }}
            renderValue={(selected) => {
                const selectedRole = DB.find((role) => role.value === selected);
                return selectedRole ? selectedRole.label : '';
            }}
        >
            {DB.map((role) => (
                <StyledMenuItem key={role.value} value={role.value}>
                    <div>
                        <Typography variant="body2" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
                            {role.label}
                        </Typography>
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 'bold' ,display: 'block' }}>
                            {role.description}
                        </Typography>
                    </div>
                </StyledMenuItem>
            ))}
        </Select>
    );
}

export default RoleSelect;
