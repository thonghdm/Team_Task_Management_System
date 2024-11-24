import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ProjectTimeline = () => {
  const data = [
    { month: 'Jan', completed: 4, inProgress: 6, planned: 3 },
    { month: 'Feb', completed: 6, inProgress: 4, planned: 5 },
    { month: 'Mar', completed: 8, inProgress: 5, planned: 4 },
    { month: 'Apr', completed: 7, inProgress: 3, planned: 6 }
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Project Progress Timeline
        </Typography>
        <Box sx={{ height: 300, mt: 2 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="completed" 
                stroke="#4caf50" 
                strokeWidth={2}
                name="Completed"
              />
              <Line 
                type="monotone" 
                dataKey="inProgress" 
                stroke="#2196f3" 
                strokeWidth={2}
                name="In Progress"
              />
              <Line 
                type="monotone" 
                dataKey="planned" 
                stroke="#ff9800" 
                strokeWidth={2}
                name="Planned"
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProjectTimeline;