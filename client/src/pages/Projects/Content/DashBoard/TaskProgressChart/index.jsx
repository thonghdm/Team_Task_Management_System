import React from 'react';
import { 
  Typography, 
  Paper 
} from '@mui/material';
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

const TaskProgressChart = ({dataTaskDetails}) => {
  // const taskProgressData = [
  //   { month: 'T1', tasks: 40, done: 30, todo: 10, incoming: 10 },
  //   { month: 'T2', tasks: 55, done: 15, todo: 15, incoming: 40 },
  //   { month: 'T3', tasks: 75, done: 25, todo: 20, incoming: 50 },
  //   { month: 'T4', tasks: 60, done: 20, todo: 12, incoming: 35 },
  //   { month: 'T5', tasks: 85, done: 30, todo: 25, incoming: 55 },
  //   { month: 'T6', tasks: 70, done: 25, todo: 18, incoming: 45 },
  //   { month: 'T7', tasks: 55, done: 18, todo: 12, incoming: 35 },
  //   { month: 'T8', tasks: 75, done: 27, todo: 20, incoming: 48 },
  //   { month: 'T9', tasks: 60, done: 22, todo: 15, incoming: 38 },
  //   { month: 'T10', tasks: 85, done: 35, todo: 25, incoming: 55 },
  //   { month: 'T11', tasks: 70, done: 28, todo: 20, incoming: 42 },
  // ];

  return (
    <Paper sx={{ p: 2, height: '400px' }}>
      <Typography variant="h6" gutterBottom>
      Mission Progress Details
      </Typography>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={dataTaskDetails}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="tasks" 
            stroke="#8884d8" 
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 8 }}
          />
          <Line 
            type="monotone" 
            dataKey="done" 
            stroke="#82ca9d" 
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 8 }}
          />
          <Line 
            type="monotone" 
            dataKey="todo" 
            stroke="red" 
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 8 }}
          />
          <Line 
            type="monotone" 
            dataKey="incoming" 
            stroke="#ff7300" 
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default TaskProgressChart;