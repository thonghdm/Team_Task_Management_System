import React, { useCallback, useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  AvatarGroup,
  IconButton,
  Menu,
  MenuItem,
  Tooltip
} from '@mui/material';
import { MoreVert as MoreVertIcon, Add as AddIcon, QuestionAnswer as QuestionAnswerIcon, ExpandMore as ExpandMoreIcon, DensityMedium as DensityMediumIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import './styles.css';
import ChangeList from './ChangeList';
import ButtonAdd from './ChangeList/ButtonAdd';

const tasks = [
  {
    id: 1,
    name: '[Example taskExample taskExample taskExakExample taskExample taskExample taskExample taskExample taskExample taskExample taskExample taskExample taskExample taskExample taskExample taskExample taskExample taskExample taskExample taskExample taskExample taskExample taskExample taskExample taskExample taskExample taskExample taskExample taskExample taskExample taskExample taskExample taskExample taskExample taskExample taskExample taskExample taskExample tasmple taskExample taskExample taskExample taskExample taskExample taskExample taskExample taskExaExample taskExample taskExample taskExample taskExample taskmple taskExample taskExample taskExample task]',
    list: 'Completed',
    labels: [],
    members: [
      { name: 'John Doe', avatar: 'https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/img.jpg' },
      { name: 'Jane Smith', avatar: 'https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/img.jpg' },
      { name: 'John Doe', avatar: 'https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/img.jpg' },
      { name: 'Jane Smith', avatar: 'https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/img.jpg' },
      { name: 'John Doe', avatar: 'https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/img.jpg' },
      { name: 'Jane Smith', avatar: 'https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/img.jpg' }
    ],
    dueDate: '12/12/2023',
    state: 'Completed',
    comment: 5
  },
  {
    id: 2,
    name: 'Backlog',
    list: 'Backlog',
    labels: [],
    members: [],
    dueDate: '12/12/2023',
    state: 'In Progress',
    comment: 5
  },
  {
    id: 3,
    name: '[Example task]',
    list: 'Backlog',
    labels: [],
    members: [],
    dueDate: '12/12/2023',
    state: 'In Progress',
    comment: 5
  },
  {
    id: 4,
    name: 'Design & Research',
    list: 'Design',
    labels: [],
    members: [],
    dueDate: '12/10/2023',
    state: 'Completed',
    comment: 5
  },
  {
    id: 5,
    name: '[Example task with designs]',
    list: 'Design',
    labels: [],
    members: [],
    dueDate: '12/10/2023',
    state: 'Completed',
    comment: 5
  },
  {
    id: 6,
    name: 'To Do',
    list: 'To Do',
    labels: [],
    members: [],
    dueDate: '12/10/2025',
    state: 'In Progress',
    comment: 5
  },
  {
    id: 7,
    name: 'Doing',
    list: 'Doing',
    labels: [],
    members: [],
    dueDate: '12/10/2025',
    state: 'Completed',
    comment: 5
  },
  {
    id: 8,
    name: '[Example task]',
    list: 'Doing',
    labels: [
      { name: 'To Do', color: 'red' },
      { name: 'To Do', color: 'red' },
      { name: 'To Do', color: 'red' },
      { name: 'To Do', color: 'red' }
    ],
    members: [],
    dueDate: '12/10/2025',
    state: 'Completed',
    comment: 5
  },
  {
    id: 9,
    name: 'Code Review',
    list: 'Code Review',
    labels: [],
    members: [],
    dueDate: '12/10/2025',
    state: 'To Do',
    comment: 5
  },
  {
    id: 11,
    name: '[Example task]',
    list: 'Code Review',
    labels: [],
    members: [],
    dueDate: '12/10/2025',
    state: 'To Do',
    comment: 5
  },
  {
    id: 12,
    name: '[Example taskExample taskExample taskExample taskExample taskExample taskExample taskExample taskExample taskExample taskExample taskExaExample taskExample taskExample taskExample taskExample taskmple taskExample taskExample taskExample task]',
    list: 'Code Review',
    labels: [],
    members: [],
    dueDate: '12/10/2025',
    state: 'To Do',
    comment: 5
  },
  {
    id: 13,
    name: 'Testing',
    list: '',
    labels: [],
    members: [],
    dueDate: '',
    state: '',
    comment: 5
  }
];


const updatedTasks = tasks.map(task => ({
  ...task,
  name: task.name || '.',
  list: task.list || '.',
  labels: task.labels.length === 0 ? ['.'] : task.labels,
  members: task.members.length === 0 ? [{ name: '.', avatar: '' }] : task.members,
  dueDate: task.dueDate || '.'
}));

const TaskBoard = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [hoveredCell, setHoveredCell] = useState(null);

  const [showNameMenu, setShowNameMenu] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);


  const theme = useTheme();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCellHover = (cellId) => {
    setHoveredCell(cellId);
  };

  const handleAddClick = (taskId) => {
    console.log(`Add clicked for task ${taskId}`);
    // Thêm logic xử lý khi click vào icon Add ở đây
  };

  // Handle Name click
  const handleOpenNameMenu = (task) => {
    setSelectedTask(task);
    setShowNameMenu(true);
  };
  const handleCloseNameMenu = () => {
    setShowNameMenu(false);
    setSelectedTask(null);
  };

  const handleNameClick = (taskId, cellId) => {
    console.log(`Name clicked: taskId=${taskId}, cellId=${cellId}`);
    handleOpenNameMenu(taskId);
  };


  const renderTableCell = (content, taskId, cellId, isEmpty) => {
    const isTrulyEmpty = isEmpty || (typeof content === 'string' && content.trim() === '.');

    const handleClick = () => {
      console.log(cellId);
      switch (cellId) {
        case 'name':
          handleNameClick(taskId, cellId);
          break;
        default:
          console.log(`Unknown column type: ${cellId}`);
      }
    };

    return (
      <TableCell
        sx={{
          color: theme.palette.text.primary,
          '&:hover': { backgroundColor: theme.palette.action.hover },
          position: 'relative',
          cursor: 'pointer'
        }}
        onMouseEnter={() => handleCellHover(`${taskId}-${cellId}`)}
        onMouseLeave={() => handleCellHover(null)}
        onClick={handleClick} // Use handleClick function here
      >
        {content}
        {hoveredCell === `${taskId}-${cellId}` && (
          <Tooltip title={isTrulyEmpty ? "Add" : "Expand"}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleAddClick(taskId);
              }}
              sx={{
                position: 'absolute',
                top: '50%',
                right: '8px',
                transform: 'translateY(-50%)',
                backgroundColor: theme.palette.background.paper,
                '&:hover': { backgroundColor: theme.palette.action.hover },
              }}
            >
              {isTrulyEmpty ? <AddIcon sx={{ width: '13px', height: '13px', cursor: 'pointer' }} />
                : <ExpandMoreIcon sx={{ width: '13px', height: '13px', cursor: 'pointer' }} />}
            </IconButton>
          </Tooltip>
        )}
      </TableCell>
    );
  };

  return (
    <>
      <Paper elevation={3} sx={{ mt: 2, backgroundColor: 'background.default', color: 'text.primary' }}>
        <TableContainer className="scrollable" sx={{ borderColor: theme.palette.divider, maxHeight: 640 }}>
          <Table stickyHeader aria-label="sticky table" sx={{ borderColor: theme.palette.divider }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: theme.palette.text.primary, fontWeight: 'bold', textAlign: 'center' }}>ID</TableCell>
                <TableCell sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>Task</TableCell>
                <TableCell sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>List</TableCell>
                <TableCell sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>State</TableCell>
                <TableCell sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>Labels</TableCell>
                <TableCell sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>Members</TableCell>
                <TableCell sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>Comment</TableCell>
                <TableCell sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>
                  Due date
                  <IconButton
                    aria-label="more"
                    id="long-button"
                    aria-controls={Boolean(anchorEl) ? 'long-menu' : undefined}
                    aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
                    aria-haspopup="true"
                    onClick={handleClick}
                    sx={{ color: theme.palette.text.primary }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id="long-menu"
                    MenuListProps={{
                      'aria-labelledby': 'long-button',
                    }}
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleClose}>Sort ascending</MenuItem>
                    <MenuItem onClick={handleClose}>Sort descending</MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {updatedTasks.map((task) => (
                <TableRow
                  key={task.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell
                    key={task.id}
                    component="th"
                    scope="row"
                    sx={{
                      color: theme.palette.text.primary,
                      '&:hover': { backgroundColor: theme.palette.action.hover },
                      maxHeight: '100px',
                      position: 'relative',
                      textAlign: 'center',
                      justifyContent: 'space-between', // ensures the icon stays left and text right
                    }}
                    onMouseEnter={() => handleCellHover(task.id)}
                    onMouseLeave={() => handleCellHover(null)}
                  >
                    {hoveredCell === task.id && (
                      <Tooltip title="Expand">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddClick(task.id);
                          }}
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '1px',
                            transform: 'translateY(-50%)',
                            backgroundColor: theme.palette.background.paper,
                            '&:hover': { backgroundColor: theme.palette.action.hover },
                          }}
                        >
                          <DensityMediumIcon
                            sx={{
                              width: '13px',
                              height: '13px',
                              cursor: 'pointer',
                            }}
                          />
                        </IconButton>
                      </Tooltip>
                    )}
                    {task.id}
                  </TableCell>
                  {renderTableCell(
                    <Box sx={{ maxWidth: "400px", overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                      {task.name.length > 50 ? `${task.name.slice(0, 50)}...` : task.name}
                    </Box>,
                    task.id,
                    'name',
                    !task.name || task.name === '.',
                  )
                  }

                  {renderTableCell(task.list, task.id, 'list', !task.list || task.list === '.')}

                  {renderTableCell(
                    <Box sx={{ display: 'flex' }}>
                      {task.state && task.state !== '.' ? (
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            mt: '4px',
                            borderRadius: '50%',
                            marginRight: 1,
                            backgroundColor: task.state === 'Completed'
                              ? 'green'
                              : task.state === 'To Do'
                                ? 'red'
                                : 'yellow'
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            mt: '4px',
                            borderRadius: '50%',
                            marginRight: 1,
                            backgroundColor: 'transparent'
                          }}
                        />
                      )}
                      {task.state || '.'}
                    </Box>,
                    task.id,
                    'state',
                    !task.state || task.state === '.'
                  )}

                  {renderTableCell(
                    <Box sx={{ display: 'flex', flexWrap: 'nowrap', maxWidth: '90px', overflow: 'hidden' }}>
                      {task.labels.slice(0, 2).map((label, index) => (
                        <Chip
                          key={index}
                          label={label.name || '.'}
                          size="small"
                          sx={{
                            backgroundColor: label.color || 'transparent',
                            marginRight: 1,
                            marginBottom: 1
                          }}
                        />
                      ))}
                      {task.labels.length > 2 && (
                        <Chip
                          label="..."
                          size="small"
                          sx={{ marginRight: 1, marginBottom: 1, backgroundColor: 'transparent' }}
                        />
                      )}
                    </Box>,
                    task.id,
                    'labels',
                    task.labels.length === 0 || (task.labels.length === 1 && task.labels[0] === '.')
                  )}

                  {renderTableCell(
                    <AvatarGroup
                      max={3}
                      sx={{
                        justifyContent: 'left',
                        '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '0.75rem' }
                      }}
                    >
                      {task.members && task.members.length > 0 ? (
                        task.members.map((member, index) => (
                          member.avatar ? (
                            <Avatar
                              key={index}
                              alt={member.name || '.'}
                              src={member.avatar}
                              sx={{ width: 24, height: 24 }}
                            />
                          ) : (
                            <span key={index}>.</span>
                          )
                        ))
                      ) : null}
                    </AvatarGroup>,
                    task.id,
                    'members',
                    task.members.length === 0 || (task.members.length === 1 && task.members[0].name === '.')
                  )}

                  <TableCell
                    component="th"
                    scope="row"
                    sx={{
                      color: theme.palette.text.primary,
                      '&:hover': { backgroundColor: theme.palette.action.hover },
                      maxHeight: '100px' // Add maxHeight
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <QuestionAnswerIcon sx={{ marginRight: 1, fontSize: 'small' }} />
                      {task.comment}
                    </Box>
                  </TableCell>

                  {renderTableCell(task.dueDate || '.', task.id, 'dueDate', !task.dueDate || task.dueDate === '.')}

                </TableRow>
              ))}
              {showNameMenu && selectedTask && (
                <ChangeList open={showNameMenu} onClose={handleCloseNameMenu} taskId={selectedTask} />
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <ButtonAdd />

    </>
  );
};

export default TaskBoard;