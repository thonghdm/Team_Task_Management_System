import React from 'react';
import {
  Typography,
  Paper,
  Box,
  useTheme,
  alpha
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

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

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Paper
        elevation={3}
        sx={{
          p: 1.5,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
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

const TaskProgressChart = ({ dataTaskDetails }) => {
  const theme = useTheme();

  const COLORS = {
    tasks: theme.palette.primary.main,
    done: theme.palette.success.main,
    todo: theme.palette.error.main,
    incoming: theme.palette.warning.main
  };

  return (
    <StyledPaper elevation={0}>
      <ChartTitle variant="h6">
        Mission Progress Details
      </ChartTitle>
      <ChartContainer>
        {dataTaskDetails?.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={dataTaskDetails}
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
              <Legend
                verticalAlign="top"
                height={36}
                wrapperStyle={{
                  paddingBottom: 20
                }}
              />
              <Line
                type="monotone"
                name="Total Tasks"
                dataKey="tasks"
                stroke={COLORS.tasks}
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 8, strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                name="Completed Tasks"
                dataKey="done"
                stroke={COLORS.done}
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 8, strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                name="To Do Tasks"
                dataKey="todo"
                stroke={COLORS.todo}
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 8, strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                name="Incoming Tasks"
                dataKey="incoming"
                stroke={COLORS.incoming}
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 8, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <NoDataContainer>
            <img
              src="https://cdn-icons-png.freepik.com/256/11329/11329073.png"
              alt="No data available"
            />
            <Typography variant="body1">
              No task progress data available
            </Typography>
          </NoDataContainer>
        )}
      </ChartContainer>
    </StyledPaper>
  );
};

export default TaskProgressChart;