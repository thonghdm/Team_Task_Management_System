import { useState } from 'react';
import {
  Button,
  Box,
  Menu,
  Typography,
  Tooltip,
  MenuItem,
  MenuList,
  ListItemText,
  ListItemIcon,
  TextField
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
// import BackupTableIcon from '@mui/icons-material/BackupTable';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AddIcon from '@mui/icons-material/Add';
// import ContentCutIcon from '@mui/icons-material/ContentCut';
// import ContentCopyIcon from '@mui/icons-material/ContentCopy';
// import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import DeleteIcon from '@mui/icons-material/Delete';
// import CloudIcon from '@mui/icons-material/Cloud';
import CloseIcon from '@mui/icons-material/Close';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { toast } from 'react-toastify';
// import { useDispatch, useSelector } from 'react-redux';
import { useConfirm } from 'material-ui-confirm';
import { useTheme } from '@mui/material';
//
import Cards from './Cards/Cards';
// import { boardSelector } from '~/redux/selectors/boardSelector';
// import { createNewCard } from '~/redux/thunk/card';
// import { deleteColumn } from '~/redux/thunk/column';

import { useDispatch, useSelector } from 'react-redux'
import { createNewTask } from '~/apis/Project/taskService'
import { useRefreshToken } from '~/utils/useRefreshToken'
import { getListIDProjectDetails } from '~/utils/getListIDProjectDetails';
import { fetchProjectDetail, resetProjectDetail } from '~/redux/project/projectDetail-slide';
import { getRandomColor } from '~/utils/radomColor';
import { createAuditLog_project } from '~/redux/project/auditlog-slice/auditlog_project';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import { updateList } from '~/apis/Project/listService';
import { addNotification } from '~/redux/project/notifications-slice/index';


export default function Column({ column }) {
  //   const board = useSelector(boardSelector);
  //   const dispatch = useDispatch();
  const theme = useTheme();
  const confirmDeleteColumn = useConfirm();

  const [option, setOption] = useState(null);
  const [template, setTemplate] = useState(null);
  const [openFormCreateCard, setOpenFormCreateCard] = useState(false);
  const [valueInputNewCard, setValueInputNewCard] = useState('');

  const toggleOpenFormCreateCard = () => {
    setOpenFormCreateCard(!openFormCreateCard);
    setValueInputNewCard('');
  };

  const openOption = Boolean(option);
  // const openTemplate = Boolean(template);
  const handleClickOpenOption = (event) => {
    setOption(event.currentTarget);
  };
  const handleCloseOption = () => {
    setOption(null);
  };
  // const handleClickOpenTemplate = (event) => {
  //   setTemplate(event.currentTarget);
  // };
  // const handleCloseTemplate = () => {
  //   setTemplate(null);
  // };

  ////////////////////////////////////////////////////////////////////////
  // refresh token die
  const refreshToken = useRefreshToken();
  //

  const [startDate, setStartDate] = useState(dayjs());
  const [dueDate, setDueDate] = useState(new Date());
  const dispatch = useDispatch();
  const { projectId } = useParams();
  const { accesstoken, userData } = useSelector(state => state.auth)
  const { projectData } = useSelector((state) => state.projectDetail);


  const { members } = useSelector((state) => state.memberProject);
  const currentUserRole = members?.members?.find(
    member => member?.memberId?._id === userData?._id
  )?.isRole;
  const isViewer = currentUserRole === 'Viewer';



  const handleClickAddCard = async () => {
    if (isViewer) {
      toast.error('You do not have permission to create a task');
      return;
    }
    if (!valueInputNewCard) {
      toast.error('Please write a new task title');
      return;
    }
    const taskData = {
      task_name: valueInputNewCard,
      list_id: column._id,
      created_by_id: userData._id,
      project_id: projectId,
      start_date: startDate,
      end_date: dueDate,
      color: getRandomColor()
    };
    const handleSuccess = (message) => {
      toast.success(message || 'Task created successfully!');
    };

    const createTask = async (token) => {
      try {
        const response = await createNewTask(token, taskData);
        await dispatch(createAuditLog_project({
          accesstoken: token,
          data: {
            project_id: projectId,
            action: 'Create',
            entity: 'Task',
            user_id: userData?._id,
            task_id: response?.task?._id,
          }
        })
        )

        await dispatch(fetchProjectDetail({ accesstoken: token, projectId }))

        handleSuccess(response.message);

      } catch (error) {
        if (error.response?.status === 401) {
          const newToken = await refreshToken();
          return createTask(newToken);
        }
        throw error;
      }
    };
    try {
      await createTask(accesstoken);

    } catch (error) {
      toast.error('Error creating task!' || error.response?.data.message);
    }
    // dispatch(
    //   createNewCard({
    //     title: valueInputNewCard,
    //     boardId: board._id,
    //     columnId: column._id
    //   })
    // );
    toggleOpenFormCreateCard();
  };

  const handleKeyDownInputNewCard = (e) => {
    if (e.keyCode !== 13) return;
    if (!valueInputNewCard.trim()) {
      toast.error('Please enter a new task title.');
      return;
    }
    handleClickAddCard();
    toggleOpenFormCreateCard();
  };

  //
  const handleClickDeleteColumn = async () => {
    if (isViewer) {
      toast.error('You do not have permission to remove a list');
      return;
    }
    const listData = {
      is_active: false
    };
    const handleSuccess = (message) => {
      toast.success(message || 'List delete successfully!');
    };

    const notificationData = members.members
      .filter(member => member.memberId._id !== userData._id && member.is_active === true)
      .map(member => ({
        senderId: userData._id,
        receiverId: member.memberId._id,
        projectId: projectId,
        type: 'project_update',
        message: `${userData?.displayName || 'User'} deleted list "${column?.list_name || 'Untitled'}" in project "${projectData?.project?.projectName}"`
      }))

    const update = async (token) => {
      try {
        const resultAction = await dispatch(fetchProjectDetail({ accesstoken: token, projectId }))
        if (fetchProjectDetail.rejected.match(resultAction)) {
          if (resultAction.payload?.err === 2) {
            const newToken = await refreshToken();
            return update(newToken);
          }
          throw new Error('Project failed');
        }
        await dispatch(addNotification({ accesstoken: token, data: notificationData }))
      }
      catch (error) {
        throw error;
      }
    }

    const deleteList = async (token) => {
      try {
        const response = await updateList(token, column._id, listData);
        const res = await dispatch(createAuditLog_project({
          accesstoken: token,
          data: {
            project_id: projectId,
            action: 'Delete',
            entity: 'List',
            user_id: userData?._id,
            list_id: response?.list?._id,
          }
        })
        )
        await update(accesstoken);
        handleSuccess(response.message);
      } catch (error) {
        if (error.response?.status === 401) {
          const newToken = await refreshToken();
          return deleteList(newToken);
        }
        throw error;
      }
    };
    try {
      await deleteList(accesstoken);
    } catch (error) {
      toast.error('Error creating task!' || error.response?.data.message);
    }
    // dispatch(deleteColumn(column._id));
  };

  const cardsOrdered = column?.tasks;

  // Drag - Drop
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: column._id, data: { ...column } });
  const dndkitColumnStyles = {
    // Nếu sử dụng CSS transform thì biến đổi cả về scale, nên sử dụng translate để di chuyển thôi
    transform: CSS.Translate.toString(transform),
    transition,
    touchAction: 'none',
    marginLeft: '.7rem',
    height: '100%'
  };

  return (
    // Khi thêm sortable cho card thì column bị bug nên phải wrap thêm 1 div cho 2 column cùng chiều dài
    <div ref={setNodeRef} style={dndkitColumnStyles} {...attributes}>
      <Box
        {...listeners}
        sx={{
          // isDragging
          opacity: isDragging ? 0.5 : 1,
          minWidth: '272px',
          maxWidth: '272px',
          bgcolor: (theme) =>
            theme.palette.mode === 'dark' ? '#3C3C3C' : '#f3f3f3',
          borderRadius: '8px',
          height: 'fit-content',
          //   maxHeight: (theme) =>
          //     `calc(${theme.customTrello.boardContentHeight} - ${theme.spacing(
          //       5
          //     )})`
        }}
      >
        {/* Column header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            // height: (theme) => theme.customTrello.headerCardHeight,
            padding: '.5rem 1rem'
          }}
        >
          <Typography
            sx={{ fontWeight: 'bold', fontSize: '1rem', color: 'primary.main' }}
          >
            {column?.list_name}
          </Typography>
          <Box>
            <IconButton
              id="basic-button-columnCard-options"
              aria-controls={openOption ? 'basic-menu-recent' : undefined}
              aria-haspopup="true"
              aria-expanded={openOption ? 'true' : undefined}
              sx={{
                '&.MuiButtonBase-root': {
                  padding: 0
                },
                overflow: 'unset'
              }}
              onClick={handleClickOpenOption}
            >
              <Tooltip title="More options">
                <MoreHorizIcon />
              </Tooltip>
            </IconButton>
            <Menu
              id="basic-menu-recent"
              anchorEl={option}
              open={openOption}
              onClick={handleCloseOption}
              MenuListProps={{
                'aria-labelledby': 'basic-button-columnCard-options'
              }}
            >
              <MenuList>
                <MenuItem onClick={toggleOpenFormCreateCard}>
                  <ListItemIcon>
                    <AddIcon />
                  </ListItemIcon>
                  <ListItemText>Add new task</ListItemText>
                </MenuItem>
                {/* <MenuItem>
                  <ListItemIcon>
                    <ContentCutIcon />
                  </ListItemIcon>
                  <ListItemText>Cut</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <ContentCopyIcon />
                  </ListItemIcon>
                  <ListItemText>Copy</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <ContentPasteIcon />
                  </ListItemIcon>
                  <ListItemText>Paste</ListItemText>
                </MenuItem> */}
                <MenuItem
                  sx={{
                    '&:hover': {
                      color: 'warning.dark',
                      '& .detele-icon': {
                        color: 'warning.dark'
                      }
                    }
                  }}
                  onClick={handleClickDeleteColumn}
                >
                  <ListItemIcon>
                    <DeleteIcon className="detele-icon" />
                  </ListItemIcon>
                  <ListItemText>Remove this column</ListItemText>
                </MenuItem>
                {/* <MenuItem onClick={handleCloseOption}>
                  <ListItemIcon>
                    <CloudIcon />
                  </ListItemIcon>
                  <ListItemText>Archive this column</ListItemText>
                </MenuItem> */}
              </MenuList>
            </Menu>
          </Box>
        </Box>

        {/* Column content */}
        <Box>
          <Cards tasks={cardsOrdered} />
        </Box>

        {/* Column footer */}
        {!openFormCreateCard ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              //   height: (theme) => theme.customTrello.footerCardHeight,
              padding: '.5rem 1rem'
            }}
          >
            <Button
              onClick={toggleOpenFormCreateCard}
              startIcon={<AddIcon />}
              sx={{
                color: theme.palette.text.primary,
                '&:hover': {
                  backgroundColor: 'transparent', // or 'null' if you want no background change
                  color: theme.palette.primary.main
                },
              }}
            >
              Add a Task
            </Button>
            {/* <Box>
              <IconButton
                id="basic-button-columnCard-options"
                aria-controls={openTemplate ? 'basic-menu-recent' : undefined}
                aria-haspopup="true"
                aria-expanded={openTemplate ? 'true' : undefined}
                sx={{
                  '&.MuiButtonBase-root': {
                    padding: 0
                  },
                  cursor: 'pointer',
                  overflow: 'unset',
                  color: 'primary.main'
                }}
                onClick={handleClickOpenTemplate}
              >
                <Tooltip title="More options">
                  <BackupTableIcon fontSize="small" />
                </Tooltip>
              </IconButton>
              <Menu
                id="basic-menu-recent"
                anchorEl={template}
                open={openTemplate}
                MenuListProps={{
                  'aria-labelledby': 'basic-button-columnCard-options'
                }}
                onClick={handleCloseTemplate}
              >
                <MenuList dense>
                  <Box
                    sx={{
                      minWidth: '280px',
                      maxWidth: '280px',
                      paddingX: '1rem'
                    }}
                  >
                    <Box
                      sx={{
                        marginLeft: '4rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Box>Card templates</Box>
                      <CloseIcon onClick={handleCloseTemplate} />
                    </Box>
                    <Typography align="center" sx={{ marginY: '1rem' }}>
                      You do not have any templates. Create a template to make
                      copying tasks easy.
                    </Typography>
                    <Button variant="contained" sx={{ width: '100%' }}>
                      Create a new template
                    </Button>
                  </Box>
                </MenuList>
              </Menu>
            </Box> */}
          </Box>
        ) : (
          <Box
            sx={{
              width: '100%',
              p: 1,
              bgcolor: theme.palette.background.default,
              borderRadius: 2
            }}
          >
            <form action="" onSubmit={(e) => e.preventDefault()}>
              <TextField
                id=""
                label="New task name..."
                size="small"
                variant="outlined"
                autoFocus={true}
                sx={{
                  minWidth: 120,
                  borderRadius: 1,
                  border: 'none',
                  outline: 'none',
                  bgcolor: theme.palette.background.paper,
                  width: '100%'
                }}
                data-no-dnd={true}
                value={valueInputNewCard}
                onChange={(e) => setValueInputNewCard(e.target.value)}
                onKeyDown={handleKeyDownInputNewCard}
              />
              <Box sx={{ marginTop: 0.5 }}>
                <Button
                  sx={{ color: theme.palette.primary.contrastText, backgroundColor: theme.palette.primary.main }}
                  variant="contained"
                  size="small"
                  onClick={handleClickAddCard}
                >
                  Add
                </Button>
                <IconButton>
                  <CloseIcon color="error" onClick={toggleOpenFormCreateCard} />
                </IconButton>
              </Box>
            </form>
          </Box>
        )}
      </Box>
    </div>
  );
}
