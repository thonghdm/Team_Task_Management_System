import React from 'react';
import {
    Box,
    Grid,
    Typography,
    Paper,
    useTheme,
    useMediaQuery,
    alpha
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend
} from 'recharts';

const COLORS = [
    '#4CD2C0', // Teal
    '#FFB84D', // Orange
    '#E587FF', // Purple
    '#FF7A7A', // Red
    '#A9FF8E', // Green
    '#7A9FFF'  // Blue
];

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius * 1.5,
    boxShadow: theme.shadows[2],
    transition: 'all 0.3s ease-in-out',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
        boxShadow: theme.shadows[8],
        transform: 'translateY(-4px)',
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: theme.palette.primary.main,
        opacity: 0.8,
    }
}));

const ChartTitle = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.primary,
    fontWeight: 600,
    marginBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    '&::after': {
        content: '""',
        flex: 1,
        marginLeft: theme.spacing(2),
        height: '1px',
        background: alpha(theme.palette.divider, 0.1),
    }
}));

const ChartContainer = styled(Box)(({ theme }) => ({
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
    padding: theme.spacing(2),
    animation: 'fadeIn 0.5s ease-out',
    '@keyframes fadeIn': {
        '0%': {
            opacity: 0,
            transform: 'translateY(10px)'
        },
        '100%': {
            opacity: 1,
            transform: 'translateY(0)'
        }
    }
}));

const NoDataContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    color: theme.palette.text.secondary,
    '& img': {
        maxHeight: '60%',
        maxWidth: '60%',
        opacity: 0.7,
        marginBottom: theme.spacing(2),
    }
}));

const ChartCard = ({ title, children }) => {
    return (
        <StyledPaper elevation={0}>
            <ChartTitle variant="h6">
                {title}
            </ChartTitle>
            <ChartContainer>
                {children}
            </ChartContainer>
        </StyledPaper>
    );
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <Paper
                elevation={3}
                sx={{
                    p: 1.5,
                    backgroundColor: 'background.paper',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: 1
                }}
            >
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    {label}
                </Typography>
                {payload.map((entry, index) => (
                    <Typography
                        key={index}
                        variant="body2"
                        sx={{
                            color: entry.color,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5
                        }}
                    >
                        {entry.name}: {entry.value}
                    </Typography>
                ))}
            </Paper>
        );
    }
    return null;
};

const ProjectAnalyticsDashboard = ({ dataPriorityDistribution, dataParticipantTrend }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
    const sum = dataPriorityDistribution?.reduce((acc, item) => acc + item.value, 0) || 0;

    return (
        <Box sx={{ flexGrow: 1 , mt:4}}>
            <Grid
                container
                spacing={2.5}
                direction={isSmallScreen ? 'column' : 'row'}
            >
                <Grid item xs={12} md={8}>
                    <ChartCard title="Participant Trends">
                        {dataParticipantTrend?.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    data={dataParticipantTrend}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke={alpha(theme.palette.divider, 0.1)}
                                    />
                                    <XAxis
                                        dataKey="month"
                                        stroke={theme.palette.text.secondary}
                                        tick={{ fill: theme.palette.text.secondary }}
                                    />
                                    <YAxis
                                        stroke={theme.palette.text.secondary}
                                        tick={{ fill: theme.palette.text.secondary }}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Bar
                                        dataKey="total_members"
                                        name="Total Members"
                                        fill={COLORS[5]}
                                        radius={[4, 4, 0, 0]}
                                    />
                                    <Bar
                                        dataKey="new_members"
                                        name="New Members"
                                        fill={theme.palette.secondary.main}
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <NoDataContainer>
                                <img
                                    src="https://cdn-icons-png.freepik.com/256/11329/11329073.png"
                                    alt="No data available"
                                />
                                <Typography variant="body1">
                                    No participant data available
                                </Typography>
                            </NoDataContainer>
                        )}
                    </ChartCard>
                </Grid>

                <Grid item xs={12} md={4}>
                    <ChartCard title="Priority Details">
                        {sum > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={dataPriorityDistribution}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={100}
                                        innerRadius={60}
                                        paddingAngle={2}
                                        dataKey="value"
                                    >
                                        {dataPriorityDistribution.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                                stroke={theme.palette.background.paper}
                                                strokeWidth={2}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend
                                        layout="vertical"
                                        align="right"
                                        verticalAlign="middle"
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <NoDataContainer>
                                <img
                                    src="https://cdn-icons-png.freepik.com/256/11329/11329073.png"
                                    alt="No data available"
                                />
                                <Typography variant="body1">
                                    No priority data available
                                </Typography>
                            </NoDataContainer>
                        )}
                    </ChartCard>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ProjectAnalyticsDashboard;