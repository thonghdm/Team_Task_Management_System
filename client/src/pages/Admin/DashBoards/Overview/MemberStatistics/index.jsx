import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  ToggleButtonGroup, 
  ToggleButton 
} from '@mui/material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';

const MemberStatistics = () => {
  const [timeRange, setTimeRange] = useState('7days');

  // Data for last 7 days
  const weeklyData = [
    { date: '19 Nov', newMembers: 3, },
    { date: '20 Nov', newMembers: 5},
    { date: '21 Nov', newMembers: 2},
    { date: '22 Nov', newMembers: 4},
    { date: '23 Nov', newMembers: 6},
    { date: '24 Nov', newMembers: 3},
    { date: '25 Nov', newMembers: 4}
  ];

  // Data for last month
  const monthlyData = [
    { date: 'Week 1', newMembers: 12},
    { date: 'Week 2', newMembers: 15},
    { date: 'Week 3', newMembers: 18},
    { date: 'Week 4', newMembers: 14}
  ];

  // Data for last 3 months
  const quarterlyData = [
    { date: 'Sep', newMembers: 45, activeMembers: 38 },
    { date: 'Oct', newMembers: 52, activeMembers: 45 },
    { date: 'Nov', newMembers: 59, activeMembers: 50 }
  ];

  const handleTimeRangeChange = (event, newRange) => {
    if (newRange !== null) {
      setTimeRange(newRange);
    }
  };

  const getDataForRange = () => {
    switch (timeRange) {
      case '7days':
        return weeklyData;
      case '1month':
        return monthlyData;
      case '3months':
        return quarterlyData;
      default:
        return weeklyData;
    }
  };

  const getRangeLabel = () => {
    switch (timeRange) {
      case '7days':
        return 'Last 7 Days';
      case '1month':
        return 'Last Month';
      case '3months':
        return 'Last 3 Months';
      default:
        return 'Member Statistics';
    }
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            Member Statistics - {getRangeLabel()}
          </Typography>
          <ToggleButtonGroup
            value={timeRange}
            exclusive
            onChange={handleTimeRangeChange}
            size="small"
          >
            <ToggleButton value="7days">7 Days</ToggleButton>
            <ToggleButton value="1month">1 Month</ToggleButton>
            <ToggleButton value="3months">3 Months</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Box sx={{ height: 316, mt: 3 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={getDataForRange()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="newMembers" 
                stroke="#2196f3" 
                strokeWidth={2}
                name="New Members"
                dot={{ r: 4 }}
              />
              {/* <Line 
                type="monotone" 
                dataKey="activeMembers" 
                stroke="#4caf50" 
                strokeWidth={2}
                name="Active Members"
                dot={{ r: 4 }}
              /> */}
            </LineChart>
          </ResponsiveContainer>
        </Box>
        <Box mt={2}>
          <Typography variant="body2" color="text.secondary">
            Total New Members: {getDataForRange().reduce((sum, item) => sum + item.newMembers, 0)}
          </Typography>
          {/* <Typography variant="body2" color="text.secondary">
            Average Activity Rate: {Math.round(getDataForRange().reduce((sum, item) => sum + (item.activeMembers / item.newMembers * 100), 0) / getDataForRange().length)}%
          </Typography> */}
        </Box>
      </CardContent>
    </Card>
  );
};

export default MemberStatistics;