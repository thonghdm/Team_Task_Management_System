import React, { useCallback, useState, useEffect } from 'react';
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
import { extractTasksInfo } from '~/utils/extractTasksInfo';
import { formatDate } from '~/utils/formattedDate';
import { fetchProjectDetail, resetProjectDetail } from '~/redux/project/projectDetail-slide';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { useRefreshToken } from '~/utils/useRefreshToken'

import ExpandTask from './ChangeList/ExpandTask';
import { formatDateRange } from '~/utils/formatDateRange'
import { ToastContainer, toast } from 'react-toastify';


const TaskBoard = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [hoveredCell, setHoveredCell] = useState(null);

  const [showNameMenu, setShowNameMenu] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const theme = useTheme();

  ////
  const { accesstoken } = useSelector(state => state.auth)
  const dispatch = useDispatch();
  const { projectData } = useSelector((state) => state.projectDetail);
  const { projectId } = useParams();
  const [getTasksInfo, setTasksInfo] = useState([]);

  const refreshToken = useRefreshToken();
  useEffect(() => {
    const getProjectDetail = async (token) => {
      try {
        await dispatch(fetchProjectDetail({ accesstoken: token, projectId })).unwrap();
      } catch (error) {
        if (error?.err === 2) {
          const newToken = await refreshToken();
          return getProjectDetail(newToken);
        }
        toast.error(error.response?.data.message || 'Unable to load project information!');
      }
    };

    getProjectDetail(accesstoken);

    return () => {
      dispatch(resetProjectDetail());
    };
  }, [dispatch, projectId, accesstoken]);

  useEffect(() => {
    if (projectData) {
      const tasksInfo = extractTasksInfo(projectData?.project);
      setTasksInfo(tasksInfo);
    }
  }, [projectData]);


  const updatedTasks = getTasksInfo.map(task => ({
    ...task,
    name: task.name || '.',
    list: task.list || '.',
    labels: task.labels.length === 0 ? ['.'] : task.labels,
    comments: task.comments.length === 0 ? 0 : task.comments.length,
    members: task.members.length === 0 ? [{ name: '.', avatar: '' }] : task.members,
    dueDate: task.end_date || '.',
  }));

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

  // const handleAddClickID = (taskId) => {
  //   // Thêm logic xử lý khi click vào icon Add ở đây
  // };

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
    handleOpenNameMenu(taskId);
  };


  const renderTableCell = (content, taskId, cellId, isEmpty) => {
    const isTrulyEmpty = !!isEmpty || (typeof content === 'string' && content.trim() === '.');
    const handleClick = () => {
      console.log(cellId);
      switch (cellId) {
        case 'task_name':
          handleNameClick(taskId, cellId);
          // navigate(`${taskId}`);
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
                border: `1px solid ${theme.palette.text.secondary}`,
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

  const shortenId = (id) => {
    if (!id) return '';
    if (id.length <= 8) return id;
    return `${id.slice(0, 2)}...${id.slice(-5)}`;
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
                  {/* <IconButton
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
                  </Menu> */}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {updatedTasks.map((task, index) => (
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
                      <Tooltip>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            // handleAddClickID(task.id);
                          }}
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '1px',
                            transform: 'translateY(-50%)',
                            backgroundColor: theme.palette.background.paper,
                            '&:hover': { backgroundColor: theme.palette.action.hover },
                            border: `1px solid ${theme.palette.text.secondary}`,
                          }}
                        >
                          {/* <DensityMediumIcon
                            sx={{
                              width: '13px',
                              height: '13px',
                              cursor: 'pointer',
                            }}
                          /> */}
                          <ExpandTask taskId={task.id} taskName={task.task_name} projectName={projectData?.project?.projectName}/>
                        </IconButton>
                      </Tooltip>
                    )}
                    {shortenId(task.id)} {/* Display the sequence number instead of task.id */}
                  </TableCell>
                  {renderTableCell(
                    <Box sx={{ maxWidth: "400px", overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                      {task.task_name.length > 45 ? `${task.task_name.slice(0, 45)}...` : task.task_name}
                    </Box>,
                    task.id,
                    'task_name',
                    !task.task_name || task.task_name === '.',
                  )}

                  {renderTableCell(
                    <Box sx={{ maxWidth: "400px", overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                      {task.list_name.length > 35 ? `${task.list_name.slice(0, 35)}...` : task.list_name}
                    </Box>,
                    task.id, 'list_name', !task.list_name || task.list_name === '.')}


                  {renderTableCell(
                    <Box sx={{ display: 'flex' }}>
                      {task.status && task.status !== '.' ? (
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            mt: '4px',
                            borderRadius: '50%',
                            marginRight: 1,
                            backgroundColor: task.status === 'Completed'
                              ? 'green'
                              : task.status === 'To Do'
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
                      {task.status || '.'}
                    </Box>,
                    task.id,
                    'status',
                    !task.status || task.status === '.'
                  )}

                  {renderTableCell(
                    <Box sx={{ display: 'flex', flexWrap: 'nowrap', maxWidth: '130px', overflow: 'hidden' }}>
                      {task.labels.slice(0, 2).map((label, index) => (
                        <Chip
                          key={index}
                          label={label.name || '.'}
                          size="small"
                          sx={{
                            backgroundColor: label.color || 'transparent',
                            marginRight: 1,
                            marginBottom: 1,
                            color: "white"
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
                      {task.comments}
                    </Box>
                  </TableCell>

                  {renderTableCell(formatDateRange(task.start_date, task.end_date) || '.', task.id, 'end_date', !task.end_date || task.end_date === '.')}

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