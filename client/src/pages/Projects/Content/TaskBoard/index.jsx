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
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Typography
} from '@mui/material';
import { MoreVert as MoreVertIcon, Add as AddIcon, QuestionAnswer as QuestionAnswerIcon, ExpandMore as ExpandMoreIcon, DensityMedium as DensityMediumIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import './styles.css';
import ChangeList from './ChangeList';
import ButtonAdd from './ChangeList/ButtonAdd';
import { extractTasksInfo } from '~/utils/extractTasksInfo';
import { fetchProjectDetail, resetProjectDetail } from '~/redux/project/projectDetail-slide';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { useRefreshToken } from '~/utils/useRefreshToken'
import { updateTaskThunks } from '~/redux/project/task-slice';
import { createAuditLog } from '~/redux/project/auditLog-slice';
import { createAuditLog_project } from '~/redux/project/auditlog-slice/auditlog_project';
import { ToastContainer, toast } from 'react-toastify';
import PrioritySelector from './ChangeList/PrioritySelector';
import StatusSelector from './ChangeList/StatusSelector';
import { addNotification } from '~/redux/project/notifications-slice/index';
import {getTaskByMemberIDThunk} from '~/redux/project/task-slice/task-inviteUser-slice/index';
import ExpandTask from './ChangeList/ExpandTask';
import { formatDateRange } from '~/utils/formatDateRange'
import ColorPickerDialog from '~/Components/ColorPickerDialog';
import AddMemberDialog from '~/Components/AddMemberDialog';
import TaskReview from './TaskReview';
import { fetchTaskById } from '~/redux/project/task-slice';

const TaskBoard = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [hoveredCell, setHoveredCell] = useState(null);

  const [showNameMenu, setShowNameMenu] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const theme = useTheme();

  ////
  const { accesstoken, userData } = useSelector(state => state.auth)
  const dispatch = useDispatch();
  const { projectData } = useSelector((state) => state.projectDetail);
  const { projectId } = useParams();
  const [getTasksInfo, setTasksInfo] = useState([]);
  
  const { members } = useSelector((state) => state.memberProject);
  const refreshToken = useRefreshToken();
  const [editDialog, setEditDialog] = useState({ open: false, type: '', taskId: null, value: '' });
  const [addLabelDialog, setAddLabelDialog] = useState({ open: false, taskId: null, value: '' });
  const [addMemberDialog, setAddMemberDialog] = useState({ open: false, taskId: null, value: '' });
  const [selectedPriority, setSelectedPriority] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [openColorPicker, setOpenColorPicker] = useState(false);
  const [openAddMemberDialog, setOpenAddMemberDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [taskReview, setTaskReview] = useState({taskId: null, task_Review: null});
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
    members: task.members.length === 0 ? [{_id: '.', name: '.', avatar: '', is_active: false }] : task.members,
    dueDate: task.end_date || '.',
    task_review_status: task.task_review_status || '.',
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
  const handleCloseColorPicker = (color, title) => {
        setOpenColorPicker(false);
        setAddLabelDialog({ open: false, taskId: null, value: '' });
  };
  const handleEditClick = (type, taskId, value) => {
    // Tìm task hiện tại từ updatedTasks
    const currentTask = updatedTasks.find(task => task.id === taskId);
    console.log("currentTask", currentTask);
    // Set giá trị ban đầu dựa trên loại chỉnh sửa
    switch (type) {
      case 'task_name':
        setEditDialog({ open: true, type, taskId, value: currentTask.task_name });
        break;
      case 'priority':
        setSelectedPriority(currentTask.priority);
        setEditDialog({ open: true, type, taskId, value: currentTask.priority });
        break;
      case 'status':
        setSelectedStatus(currentTask.status);
        setEditDialog({ open: true, type, taskId, value: currentTask.status });
        break;
      case 'labels':
        setAddLabelDialog({ open: true, taskId, value: currentTask.labels });
        setOpenColorPicker(true);
        break;
      case 'members':
        setAddMemberDialog({ open: true, taskId, value: currentTask });
        setOpenAddMemberDialog(true);
        break;
      case 'taskReview':
        break;
      default:
        setEditDialog({ open: true, type, taskId, value });
    }
  };

  const handleCloseEditDialog = () => {
    setEditDialog({ open: false, type: '', taskId: null, value: '' });
  };

  const handleCloseAddmemberDialog = () => {
    setOpenAddMemberDialog(false);
    setAddMemberDialog({ open: false, taskId: null, value: '' });
  };

  const handleSaveEdit = async () => {
    const { type, taskId, value } = editDialog;
    console.log("editDialog", editDialog, selectedStatus);
    try {
      setIsLoading(true);
      let updateData = {};
      // let notificationData = [];
      let notificationData = [];
      // Tìm task hiện tại
      const currentTask = updatedTasks.find(task => task.id === taskId);
      

      switch (type) {
        case 'task_name':
          updateData = { task_name: value };
                    notificationData = currentTask?.members
          ?.filter(member =>
              member._id !== userData._id &&
              currentTask?.members?.some(m =>
                m._id === member._id &&
                m.is_active === true
              )
            )
            .map(member => ({
              senderId: userData._id,
              receiverId: member._id,
              projectId: projectId,
              taskId: taskId,
              type: 'task_update',
              message: `${userData.displayName} has updated priority to "${selectedPriority}" in task ${currentTask?.task_name} in project ${currentTask?.project_id?.projectName}`
            }));
          break;

        case 'priority':
          updateData = { priority: selectedPriority };
          notificationData = currentTask?.members
          ?.filter(member =>
              member._id !== userData._id &&
              currentTask?.members?.some(m =>
                m._id === member._id &&
                m.is_active === true
              )
            )
            .map(member => ({
              senderId: userData._id,
              receiverId: member._id,
              projectId: projectId,
              taskId: taskId,
              type: 'task_update',
              message: `${userData.displayName} has updated priority to "${selectedPriority}" in task ${currentTask?.task_name} in project ${currentTask?.project_id?.projectName}`
            }));
          break;

        case 'status':
          updateData = { status: selectedStatus };
          
          if (selectedStatus === 'Completed') {
            updateData = { 
              ...updateData, 
              done_date: new Date().toISOString(),
              task_review_status: 'pending'
            };
          } else {
            updateData = { 
              ...updateData, 
              done_date: '1000-10-10T00:00:00.000+00:00',
              task_review_status: 'not requested'
            };
          }
          console.log("currentTask.members:", members);
          notificationData = currentTask?.members
          ?.filter(member =>
              member._id !== userData._id &&
              currentTask?.members?.some(m =>
                m._id === member._id &&
                m.is_active === true
              )
            )
            .map(member => ({
              senderId: userData._id,
              receiverId: member._id,
              projectId: projectId,
              taskId: taskId,
              type: 'task_update',
              message: `${userData.displayName} has updated status to "${selectedStatus}" in task ${currentTask?.task_name} in project ${currentTask?.project_id?.projectName}`
            }));
            console.log("updateData", notificationData);
            break;
        default:
          return;
      }

      const resultAction = await dispatch(updateTaskThunks({
        accesstoken,
        taskId,
        taskData: updateData
      }));
      console.log("resultAction",type
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ') );

      if (updateTaskThunks.fulfilled.match(resultAction)) {
        //Tạo audit log
        await dispatch(createAuditLog({
          accesstoken,
          data: {
            task_id: taskId,
            action: 'Update',
            entity: type
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' '),
            old_value: currentTask[type],
            new_value: type === 'status' ? selectedStatus : type === 'priority' ? selectedPriority : type === 'task_name' ? value : currentTask[type],
            user_id: userData?._id
          }
        }));
        await dispatch(fetchTaskById({ accesstoken: accesstoken, taskId }));
        console.log("Tạo project audit log");
        const resultActions = await dispatch(createAuditLog_project({
          accesstoken,
          data: {
              project_id: projectId,
              task_id: taskId,
              action: 'Update',
              entity: 'Task',
              user_id: userData?._id
          }
         }));
         console.log("resultActionssssssssss", resultActions);
        //Refresh data
        await dispatch(fetchProjectDetail({ accesstoken, projectId }));
        await dispatch(getTaskByMemberIDThunk({ accesstoken: accesstoken, memberID: userData?._id }));
       
        

        // Gửi thông báo
        if (notificationData.length > 0) {
          await dispatch(addNotification({ accesstoken, data: notificationData }));
        }

        toast.success('Task updated successfully!');
      } else {
        toast.error('Failed to update task');
      }
    } catch (error) {
      toast.error('Error updating taskk');
    } finally {
      setIsLoading(false);
    }
    handleCloseEditDialog();
  };

  const renderEditDialog = () => {
    const { type, value, taskId } = editDialog;
    const currentTask = updatedTasks.find(task => task.id === taskId);

    return (
      <Dialog open={editDialog.open} onClose={handleCloseEditDialog} >
                {isLoading ? (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100, mt: 2, mb: 2 , width: 100}}>
        <CircularProgress />
      </Box>
          ) : (
            <>
        <DialogTitle>Edit {type.replace('_', ' ')}</DialogTitle>
        <DialogContent>
                {type === 'task_name' && (
                  <TextField
                    fullWidth
                    value={value}
                    onChange={(e) => setEditDialog({ ...editDialog, value: e.target.value })}
                    margin="normal"
                    label="Task Name"
                    placeholder="Enter task name"
                  />
                )}
                {type === 'priority' && (
                  <Box sx={{ mt: 2 }}>
                    <PrioritySelector
                      value={selectedPriority}
                      onChange={setSelectedPriority}
                    />
                  </Box>
                )}
                {type === 'status' && (
                  <Box sx={{ mt: 2 }}>
                    <StatusSelector
                      value={selectedStatus}
                      onChange={setSelectedStatus}
                    />
                  </Box>
                )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">Save</Button>
        </DialogActions>
        </>           
        )}
      </Dialog>
    );
  };

  const renderTableCell = (content, taskId, cellId, isEmpty) => {
    const isTrulyEmpty = !!isEmpty || (typeof content === 'string' && content.trim() === '.')||cellId === 'labels'||cellId === 'members';
    const handleClick = () => {
      switch (cellId) {
        case 'task_name':
        case 'list_name':
        case 'end_date':
        case 'members':
        case 'priority':
        case 'status':
        case 'labels':
        case 'comments':
          handleNameClick(taskId, cellId);
          break;
        case 'taskReview':
          handleEditClick('taskReview', taskId, content);
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
        onClick={handleClick}
      >
        {content}
        {hoveredCell === `${taskId}-${cellId}` && cellId !== 'end_date' && cellId !== 'list_name'&& cellId !== 'comments' && cellId !== 'taskReview' && (
          <Tooltip title={isTrulyEmpty ? "Add" : "Expand"}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleEditClick(cellId, taskId, content);
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

  const handleConfirmReviewTask = async (task_accept_status, taskId) => {
    const currentTask = updatedTasks.find(task => task.id === taskId);
    console.log('accept task?', task_accept_status, taskId);
    try {
        let notificationData = [];
        let dataSave = {
            task_review_status: task_accept_status
        };
        let message = '';
        if (task_accept_status === 'accept') {
            message = `${userData.displayName} has accepted task ${currentTask?.task_name} in project ${currentTask?.project_id?.projectName}`
        } else {
            message = `${userData.displayName} has rejected task ${currentTask?.task_name} in project ${currentTask?.project_id?.projectName}`
            dataSave = { ...dataSave,  status: 'In Progress', done_date: '1000-10-10T00:00:00.000+00:00'};
        }
        notificationData = currentTask?.members
        ?.filter(member =>
            member._id !== userData._id &&
            currentTask?.members?.some(m =>
              m._id === member._id &&
              m.is_active === true
            )
          )
          .map(member => ({
            senderId: userData._id,
            receiverId: member._id,
            projectId: projectId,
            taskId: taskId,
            type: 'task_update',
            message: message
          }));
        console.log("notificationData", currentTask);
        const handleSuccess = () => {};
        const saveTaskReview = async (accesstoken) => {
            try {
                const resultAction = await dispatch(updateTaskThunks({
                    accesstoken,
                    taskId,
                    taskData: dataSave
                }));
                if (updateTaskThunks.rejected.match(resultAction)) {
                    if (resultAction.payload?.err === 2) {
                        const newToken = await refreshToken();
                        return saveTaskReview(newToken);
                    }
                    throw new Error('Delete status task failed');
                }
                await dispatch(createAuditLog({
                    accesstoken: accesstoken,
                    data: {
                        task_id: taskId,
                        action: 'Update',
                        entity: 'Task Review',
                        old_value: currentTask?.task_review_status,
                        new_value: task_accept_status,
                        user_id: userData?._id
                    }
                }));
                await dispatch(fetchTaskById({ accesstoken: accesstoken, taskId }));
                await dispatch(createAuditLog_project({
                    accesstoken: accesstoken,
                    data: {
                        project_id: projectId,
                        task_id: taskId,
                        action: 'Update',
                        entity: 'Task',
                        user_id: userData?._id
                    }
                }));
                if (projectId) await dispatch(fetchProjectDetail({ accesstoken: accesstoken, projectId }));
                await dispatch(getTaskByMemberIDThunk({ accesstoken: accesstoken, memberID: userData?._id }));
                await dispatch(addNotification({ accesstoken: accesstoken, data: notificationData }));
                handleSuccess();
                toast.success('Task updated successfully!');
            } catch (error) {
                toast.error('Error updating task');
                throw error;
            }
        };
        await saveTaskReview(accesstoken);
    }
    catch (error) {
        throw error;
    }
}
const currentUserRole = members?.members?.find(
  member => member?.memberId?._id === userData?._id
)?.isRole;

  return (
    <>
      <Paper elevation={3} sx={{ mt: 2, backgroundColor: 'background.default', color: 'text.primary' }}>
        <TableContainer className="scrollable" sx={{ borderColor: theme.palette.divider, maxHeight: 640 }}>
          <Table stickyHeader aria-label="sticky table" sx={{ borderColor: theme.palette.divider }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: theme.palette.text.primary, fontWeight: 'bold', textAlign: 'center' }}>No.</TableCell>
                <TableCell sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>Task</TableCell>
                <TableCell sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>List</TableCell>
                <TableCell sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>Priority</TableCell>
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
                <TableCell sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>
                Task Review
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
                    {index + 1} {/* Display the sequence number instead of task.id */}
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
                    <Box sx={{ display: 'flex' }}>
                      {task.priority && task.priority !== '.' ? (
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            mt: '4px',
                            borderRadius: '50%',
                            marginRight: 1,
                            backgroundColor: task?.priority === 'Low'
                            ? '#4CD2C0'
                            : task?.priority === 'High'
                              ? '#E587FF'
                              : '#FFB84D'
  
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
                      {task.priority || '.'}
                    </Box>,
                    task.id,
                    'priority',
                    !task.priority || task.priority === '.'
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

                  {/* <TableCell
                    component="th"
                    scope="row"
                    sx={{
                      color: theme.palette.text.primary,
                      '&:hover': { backgroundColor: theme.palette.action.hover },
                      maxHeight: '100px' // Add maxHeight
                    }}
                  > */}
                  {renderTableCell(
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <QuestionAnswerIcon sx={{ marginRight: 1, fontSize: 'small' }} />
                      {task.comments}
                    </Box>, task.id, 'comments', !task.comments || task.comments === '.')}
                  {/* </TableCell> */}

                  {renderTableCell(formatDateRange(task.start_date, task.end_date) || '.', task.id, 'end_date', !task.end_date || task.end_date === '.')}
                  {renderTableCell(
                    <TaskReview 
                      role={currentUserRole}
                      taskReview={task.task_review_status}
                      status={task.status}
                      onAccept={() => handleConfirmReviewTask('accept',task.id)}
                      onReject={() => handleConfirmReviewTask('reject',task.id)}
                    />,
                    task.id,
                    'taskReview',
                    !task.task_review_status || task.task_review_status === '.'
                  )}
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

      {renderEditDialog()}
      <ColorPickerDialog
        open={openColorPicker}
        onClose={handleCloseColorPicker}
        taskId={addLabelDialog.taskId}
        userData={userData}
      />
      <AddMemberDialog
        open={openAddMemberDialog}
        onClose={handleCloseAddmemberDialog }
        taskId={addMemberDialog.taskId}
        taskData={addMemberDialog.value}
      />
      <ToastContainer />
    </>
  );
};

export default TaskBoard;