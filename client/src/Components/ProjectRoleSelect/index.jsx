import React from 'react';
import { Select, MenuItem, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { useTheme } from '@mui/material/styles';

const StyledMenuItem = styled(MenuItem)(({ theme, isKickMember }) => ({
    color: theme.palette.text.primary,
    '&.Mui-selected': {
        backgroundColor: isKickMember 
            ? theme.palette.error.light
            : theme.palette.mode === 'light'
                ? theme.palette.grey[300]
                : theme.palette.grey[600],
        '&:hover': {
            backgroundColor: isKickMember 
                ? theme.palette.error.main
                : theme.palette.mode === 'light'
                    ? theme.palette.grey[300]
                    : theme.palette.grey[500],
        },
    },
}));

const RoleSelect = ({ value, onChange, DB, fullWidth }) => {
    const theme = useTheme();

    return (
        <Select
            value={value}
            onChange={onChange}
            size="small"
            fullWidth={fullWidth || false}
            sx={{ 
                minWidth: 100, 
                mr: 1,
                '& .MuiSelect-select': {
                    color: value === 'KickMember' ? theme.palette.error.main : 'inherit',
                }
            }}
            renderValue={(selected) => {
                const selectedRole = DB.find((role) => role.value === selected);
                return selectedRole ? selectedRole.label : '';
            }}
        >
            {DB.map((role) => (
                <StyledMenuItem 
                    key={role.value} 
                    value={role.value}
                    isKickMember={role.value === 'KickMember'}
                >
                    <div>
                        <Typography 
                            variant="body2" 
                            sx={{ 
                                color: role.value === 'KickMember' 
                                    ? theme.palette.error.main 
                                    : theme.palette.primary.main,
                                fontWeight: 'bold' 
                            }}
                        >
                            {role.label}
                        </Typography>
                        <Typography 
                            variant="caption" 
                            sx={{ 
                                color: role.value === 'KickMember'
                                    ? theme.palette.error.light
                                    : theme.palette.text.secondary,
                                fontWeight: 'bold',
                                display: 'block' 
                            }}
                        >
                            {role.description}
                        </Typography>
                    </div>
                </StyledMenuItem>
            ))}
        </Select>
    );
}

export default RoleSelect;