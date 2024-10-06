import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Paper } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CircularProgress from '@mui/material/CircularProgress';
import HomeLable from '../HomeLable';
import { useTheme } from '@mui/material/styles';

const data = [
    { date: '30/09', created: 0, completed: 0 },
    { date: '01/10', created: 2, completed: 0 },
    { date: '02/10', created: 0, completed: 0 },
    { date: '03/10', created: 4, completed: 0 },
    { date: '04/10', created: 0, completed: 0 },
    { date: '05/10', created: 3, completed: 0 },
    { date: '06/10', created: 0, completed: 2 },
];

const HomeChart = () => {
    const completedIssues = 2;
    const totalIssues = 9;
    const theme = useTheme();

    const progressPercentage = Math.round((completedIssues / totalIssues) * 100);

    return (
        <Paper elevation={3} sx={{ p: 2, backgroundColor: theme.palette.background.default, color: theme.palette.text.primary, mt: 3 }}>
            <HomeLable lable="Statistics" />
            <Grid container spacing={3}>
                <Grid item xs={12} md={9}>
                    <Card sx={{ backgroundColor: theme.palette.background.default, color: theme.palette.text.primary }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ textAlign: 'center' }} gutterBottom>Last 7 Days</Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis 
                                        allowDecimals={false}
                                        domain={[0, 'auto']}
                                        tickCount={5}
                                    />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="created" name="Created issues" fill="#8884d8" />
                                    <Bar dataKey="completed" name="Completed issues" fill="#82ca9d" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid
                    item xs={12} md={3}
                    container
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Card sx={{ backgroundColor: theme.palette.background.default, color: theme.palette.text.primary }}>
                        <CardContent>
                            <Typography sx={{ textAlign: 'center' }} variant="h6" gutterBottom>Overall Progress</Typography>
                            <Box sx={{ position: 'relative', display: 'inline-flex', pt: 4, pr: 2, pb: 4, pl: 2 }}>
                                <Box position="relative" display="inline-flex">
                                    <CircularProgress
                                        variant="determinate"
                                        value={100}
                                        size={200}
                                        thickness={4}
                                        sx={{ color: theme.palette.text.primary }} 
                                    />
                                    <CircularProgress
                                        variant="determinate"
                                        value={progressPercentage}
                                        size={200}
                                        thickness={4}
                                        sx={{ color: '#8884d8', position: 'absolute', left: 0 }} 
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        top: 0,
                                        left: 0,
                                        bottom: 0,
                                        right: 0,
                                        position: 'absolute',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Typography variant="h4" component="div" sx={{ color: theme.palette.text.primary }}>
                                        {`${progressPercentage}%`}
                                    </Typography>
                                </Box>
                            </Box>
                            <Typography variant="body1" sx={{
                                mt: 2,
                                display: 'flex',
                                justifyContent: 'center'
                            }} >
                                Completed issues: {completedIssues} / {totalIssues}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default HomeChart;