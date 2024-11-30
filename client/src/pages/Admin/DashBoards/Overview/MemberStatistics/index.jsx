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

const MemberStatistics = ({statisticsMember}) => {
  const [timeRange, setTimeRange] = useState('7days');
  
  const handleTimeRangeChange = (event, newRange) => {
    if (newRange !== null) {
      setTimeRange(newRange);
    }
  };

  const getDataForRange = () => {
    switch (timeRange) {
      case '7days':
        return statisticsMember.weeklyData;
      case '1month':
        return statisticsMember.monthlyData;
      case '3months':
        return statisticsMember.quarterlyData;
      default:
        return statisticsMember.weeklyData;
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