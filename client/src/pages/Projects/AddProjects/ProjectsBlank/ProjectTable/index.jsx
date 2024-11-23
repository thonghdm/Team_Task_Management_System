import React from 'react';
import {
    ThemeProvider,
    createTheme,
    Box,
    Typography,
    Tab,
    Tabs,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Avatar,
    Checkbox
} from '@mui/material';
import { styled } from '@mui/system';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import Paper from '@mui/material/Paper';
// Styled components
const StyledTab = styled(Tab)(({ theme }) => ({
    color: theme.palette.text.secondary,
    '&.Mui-selected': {
        color: theme.palette.primary.main,
    },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    borderBottom: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(1, 2),
}));

const StyledCheckbox = styled(Checkbox)(({ theme }) => ({
    color: theme.palette.text.secondary,
    '&.Mui-checked': {
        color: '#4ecb71',
    },
}));

const ProjectTable = () => {
    return (
        <Box sx={{ bgcolor: 'background.default', color: 'text.primary', p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                    sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        backgroundColor: 'text.secondary',
                        border: '1px solid',
                        borderColor: 'primary.dark',
                        mr: 2,
                    }}
                />
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ mb: "-8px", ml: 2, fontSize: "15px" }}>SSSSSSSS</Typography>
                    <Tabs
                        value={1}
                        indicatorColor="primary"
                        textColor="primary"
                        sx={{ minHeight: 'auto' }}
                    >
                        <StyledTab label="Overview" sx={{ textTransform: 'none', minWidth: '55px' }} />
                        <StyledTab label="List" sx={{ textTransform: 'none', minWidth: '55px' }} />
                        <StyledTab label="Board" sx={{ textTransform: 'none', minWidth: '55px' }} />
                        <StyledTab label="Timeline" sx={{ textTransform: 'none', minWidth: '55px' }} />
                        <StyledTab label="Calendar" sx={{ textTransform: 'none', minWidth: '55px' }} />
                        <StyledTab label="Workflow" sx={{ textTransform: 'none', minWidth: '55px' }} />
                    </Tabs>
                </Box>
                <Box
                    sx={{
                        width: 28,
                        height: 28,
                        borderRadius: 10,
                        backgroundColor: 'text.secondary',
                        border: '1px solid',
                        borderColor: 'primary.dark',
                        mb: 5,
                    }}

                />
                <Box
                    sx={{
                        width: 28,
                        height: 28,
                        borderRadius: 10,
                        backgroundColor: 'text.secondary',
                        border: '1px solid',
                        borderColor: 'primary.dark',
                        mb: 5,
                        ml: 1,
                    }}

                />
            </Box>

            {['To do', 'In progress', 'Complete'].map((section, index) => (
                <Box key={section}>
                    <Typography variant="h6" sx={{ fontSize: '1.125rem' }}>{section}</Typography>
                    <TableContainer
                    >
                        <Table>
                            <TableBody>
                                {[...Array(index === 1 ? 1 : 2)].map((_, i) => (
                                    <TableRow key={i}>
                                        <StyledTableCell width="50%">
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <StyledCheckbox
                                                    icon={<CheckCircleIcon />}
                                                    checkedIcon={<CheckCircleIcon />}
                                                    checked={section === 'Complete'}
                                                />
                                                <Typography variant="body2" sx={{ ml: 1, fontSize: '0.875rem' }}>
                                                    <Box
                                                        sx={{
                                                            width: `${Math.floor(Math.random() * 170) + 30}px`,
                                                            height: 18,
                                                            borderRadius: 2,
                                                            backgroundColor: 'text.secondary',
                                                            border: '1px solid',
                                                            borderColor: 'primary.dark',
                                                            mr: 2,
                                                            minWidth: '70px',
                                                        }}
                                                    />
                                                </Typography>
                                            </Box>
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <Avatar sx={{ width: 24, height: 24 }} />
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <CalendarTodayIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                                        </StyledTableCell>
                                        <StyledTableCell ></StyledTableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            ))}
        </Box>
    );
};

export default ProjectTable;
