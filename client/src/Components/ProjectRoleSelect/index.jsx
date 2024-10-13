import React from 'react';
import { Select, MenuItem, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { useTheme } from '@mui/material/styles';

const roles = [
    { value: 'admin', label: 'Project admin', description: 'Full access to change settings, modify, or delete the project.' },
    { value: 'editor', label: 'Editor', description: 'Can add, edit, and delete anything in the project.' },
    { value: 'commenter', label: 'Commenter', description: "Can comment, but can't edit anything in the project." },
    { value: 'viewer', label: 'Viewer', description: "Can view, but can't add comments or edit the project." },
];

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
    color: theme.palette.text.primary,
    '&:hover': {
        backgroundColor: theme.palette.mode === 'light'
            ? theme.palette.grey[50]
            : theme.palette.grey[700],
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

const RoleSelect = ({ value, onChange }) => {
    const theme = useTheme();

    return (
        <Select
            value={value}
            onChange={onChange}
            size="small"
            sx={{ minWidth: 100, mr: 1 }}
            renderValue={(selected) => {
                const selectedRole = roles.find((role) => role.value === selected);
                return selectedRole ? selectedRole.label : '';
            }}
        >
            {roles.map((role) => (
                <StyledMenuItem key={role.value} value={role.value}>
                    <div>
                        <Typography variant="body2" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
                            {role.label}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'grey.500', display: 'block' }}>
                            {role.description}
                        </Typography>
                    </div>
                </StyledMenuItem>
            ))}
        </Select>
    );
}

export default RoleSelect;
