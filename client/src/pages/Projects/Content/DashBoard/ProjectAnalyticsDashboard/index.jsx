import React, { useMemo } from 'react';
import {
    Box,
    Grid,
    Typography,
    Paper,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    ResponsiveContainer,
    RadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis
} from 'recharts';

const COLORS = ['#4CD2C0', '#FFB84D', '#E587FF', '#FF7A7A', '#A9FF8E', '#7A9FFF'];

const ChartCard = ({ title, children }) => {
    const theme = useTheme();

    return (
        <Paper
            elevation={3}
            sx={{
                p: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: theme.palette.background.paper
            }}
        >
            <Typography variant="h6" gutterBottom>
                {title}
            </Typography>
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {children}
            </Box>
        </Paper>
    );
};

const ProjectAnalyticsDashboard = ({dataPriorityDistribution, dataParticipantTrend}) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

    // const participantTrend = [
    //     { month: 'Tháng 1', total_members: 10, new_members: 5 },
    //     { month: 'Tháng 2', total_members: 15, new_members: 7 },
    //     { month: 'Tháng 3', total_members: 22, new_members: 9 },
    //     { month: 'Tháng 4', total_members: 30, new_members: 12 },
    //     { month: 'Tháng 5', total_members: 40, new_members: 15 },
    //     { month: 'Tháng 6', total_members: 40, new_members: 15 }
    // ]

    // const priorityDistribution = [
    //     { name: 'Low', value: 40 },
    //     { name: 'Medium', value: 30 },
    //     { name: 'High', value: 20 }
    // ]

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Grid
                container
                spacing={3}
                direction={isSmallScreen ? 'column' : 'row'}
            >
                <Grid item xs={12} md={8}>
                    <ChartCard title="Participant Trends">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={dataParticipantTrend}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar
                                    dataKey="total_members"
                                    fill={COLORS[5]}
                                />
                                <Bar
                                    dataKey="new_members"
                                    fill={theme.palette.secondary.main}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </Grid>
                <Grid
                    item
                    xs={12}
                    md={4}
                >
                    <ChartCard title="Priority Details">
                        <ResponsiveContainer  width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={dataPriorityDistribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={100}
                                    fill={theme.palette.primary.main}
                                    dataKey="value"
                                >
                                    {dataPriorityDistribution.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </Grid>

            </Grid>
        </Box>
    );
};

export default ProjectAnalyticsDashboard;