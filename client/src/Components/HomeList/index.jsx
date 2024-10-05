import React from 'react';
import { Box, Tabs, Tab, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import HomeItem from '../HomeItem';
import '../HomeProjectList/styles.css'; // Ensure styles are imported

const HomeList = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Sample task data
  const tasks = {
    upcoming: [
      { title: 'Draft project brief', date: 'Today - Oct 8' },
      { title: 'Schedule kickoff meeting', date: 'Oct 7 - 9' },
      { title: 'Draft project brief', date: 'Today - Oct 8' },
      { title: 'Schedule kickoff meeting', date: 'Oct 7 - 9' },
      { title: 'Draft project brief', date: 'Today - Oct 8' },
      { title: 'Schedule kickoff meeting', date: 'Oct 7 - 9' },
      { title: 'Draft project brief', date: 'Today - Oct 8' },
      { title: 'Schedule kickoff meeting', date: 'Oct 7 - 9' },
      { title: 'Draft project brief', date: 'Today - Oct 8' },
      { title: 'Schedule kickoff meeting', date: 'Oct 7 - 9' },
    ],
    overdue: [
      { title: 'Old task 1', date: 'Oct 1' },
      { title: 'Old task 2', date: 'Oct 2' },
      { title: 'Old task 1', date: 'Oct 1' },
      { title: 'Old task 2', date: 'Oct 2' },
      { title: 'Old task 1', date: 'Oct 1' },
      { title: 'Old task 2', date: 'Oct 2' },
      { title: 'Old task 1', date: 'Oct 1' },
      { title: 'Old task 2', date: 'Oct 2' },
      { title: 'Old task 1', date: 'Oct 1' },
      { title: 'Old task 2', date: 'Oct 2' },
    ],
    completed: [
      { title: 'Completed task 1', date: 'Sep 30' },
      { title: 'Completed task 2', date: 'Sep 29' },
    ],
  };
  const colorMapping = {
    upcoming: 'white',
    overdue: 'red',
    completed: 'green',
  };

  // Get the tasks for the selected tab
  const selectedTasks =
    value === 0 ? tasks.upcoming : value === 1 ? tasks.overdue : tasks.completed;

  return (
    <Box sx={{ color: 'white' }}>
      <Tabs value={value} onChange={handleChange} sx={{ mb: 2 }}>
        <Tab label="Upcoming" sx={{ color: 'white' }} />
        <Tab label="Overdue" sx={{ color: 'white' }} />
        <Tab label="Completed" sx={{ color: 'white' }} />
      </Tabs>

      {value === 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', color: '#aaa', mb: 2 }}>
          <Button variant="text" sx={{ color: '#aaa' }}>
            <AddIcon sx={{ mr: 1 }} /> {/* 'mr' là margin-right để tạo khoảng cách giữa icon và text */}
            Create task
          </Button>
        </Box>
      )}

      <Box className="scrollable" sx={{maxHeight:300}}>
        {selectedTasks.map((task, index) => (
          <HomeItem key={index} task={task.title} date={task.date}
            color={colorMapping[value === 0 ? 'upcoming' : value === 1 ? 'overdue' : 'completed']}
          />
        ))}
      </Box>
    </Box>
  );
};

export default HomeList;
