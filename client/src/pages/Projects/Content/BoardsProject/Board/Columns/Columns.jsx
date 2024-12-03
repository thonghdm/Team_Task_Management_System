import { useState } from 'react';
import { Box, Button, IconButton, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import {
  SortableContext,
  horizontalListSortingStrategy
} from '@dnd-kit/sortable';
import { toast } from 'react-toastify';
import { useTheme } from '@mui/material';

import { createNew } from '~/apis/Project/listService'
import { useRefreshToken } from '~/utils/useRefreshToken'
import { fetchProjectDetail, resetProjectDetail } from '~/redux/project/projectDetail-slide';
import { createAuditLog_project } from '~/redux/project/auditlog-slice/auditlog_project';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
//
import Column from './Column/Column';
// import { boardSelector } from '~/redux/selectors/boardSelector';
// import { createNewColumn } from '~/redux/thunk/column';

export default function Columns({ lists = [] }) {
  const theme = useTheme();
  const [openFormCreateColumn, setOpenFormCreateColumn] = useState(false);
  const [valueInputNewColumn, setValueInputNewColumn] = useState('');
  //   const dispatch = useDispatch();
  // const board = useSelector(boardSelector);

  const toggleOpenFormCreateColumn = () => {
    setOpenFormCreateColumn(!openFormCreateColumn);
    setValueInputNewColumn('');
  };

  ////////////////////////////////////////////////////////////////
  const { projectId } = useParams();
  const { accesstoken, userData } = useSelector(state => state.auth)
  const dispatch = useDispatch();

  const refreshToken = useRefreshToken();


  const handleKeyDownInputNewColumn = (e) => {
    if (e.keyCode !== 13) return;
    if (!valueInputNewColumn.trim()) {
      toast.error('Please enter a new column title.');
      return;
    }
    handleClickAddList();
    // dispatch(
    //   createNewColumn({
    //     title: valueInputNewColumn,
    //     boardId: board._id
    //   })
    // );
    toggleOpenFormCreateColumn();
  };

  const handleClickAddList = () => {
    if (!valueInputNewColumn.trim()) {
      toast.error('Please enter a new column title.');
      return;
    }

    const listData = {
      list_name: valueInputNewColumn,
      created_by_id: userData._id,
      project_id: projectId,
    };
    const handleSuccess = (message) => {
      toast.success(message || 'List created successfully!');
    };

    const createList = async (token) => {
      try {
        const response = await createNew(token, listData);
        const res = await dispatch(createAuditLog_project({
          accesstoken: token,
          data: {
            project_id: projectId,
            action: 'Create',
            entity: 'List',
            user_id: userData?._id,
            list_id: response?.list?._id,
          }
        })
        )
        await dispatch(fetchProjectDetail({ accesstoken: token, projectId }))
        handleSuccess(response.message);
      } catch (error) {
        if (error.response?.status === 401) {
          const newToken = await refreshToken();
          return createList(newToken);
        }
        throw error;
      }
    };

    try {
      createList(accesstoken);
    } catch (error) {
      toast.error(error.response?.data.message || 'Error creating list!');
    }
    // dispatch(
    //   createNewColumn({
    //     title: valueInputNewColumn,
    //     boardId: board._id
    //   })
    // );
    toggleOpenFormCreateColumn();
  };

  // SortableContext yêu cầu items là một dạng ['id-1', 'id-2'] chứ không phải dạng [{ id: 'id-1'}, { id: 'id-2'}]
  return (
    <SortableContext
      items={lists.map((column) => column._id)}
      strategy={horizontalListSortingStrategy}
    >
      <Box
        sx={{
          display: 'flex',
          height: '100%',
          maxWidth: '100vw',
          overflowX: 'auto',
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'primary.light',
            borderRadius: '10px'
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'primary.dark'
          }
        }}
      >
        {lists.map((column) => (
          <Column column={column} key={column._id} />
        ))}

        {/* Button Add Columms */}
        <Box
          sx={{
            marginLeft: '.7rem',
            borderRadius: '8px',
            bgcolor: theme.palette.primary.main,
            maxWidth: '272px',
            minWidth: '272px',
            height: 'fit-content'
          }}
        >
          {!openFormCreateColumn ? (
            <Button
              sx={{
                width: '100%',
                justifyContent: 'flex-start',
                paddingLeft: '1rem',
                paddingY: '.6rem',
                color: theme.palette.primary.contrastText,
              }}
              startIcon={<AddIcon />}
              onClick={toggleOpenFormCreateColumn}
            >
              Add another list
            </Button>
          ) : (
            <Box
              sx={{ p: 1, bgcolor: theme.palette.background.default, borderRadius: 2, transition: '2s' }}
            >
              <form action="" onSubmit={(e) => e.preventDefault()}>
                <TextField
                  id=""
                  label="New list name..."
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
                  value={valueInputNewColumn}
                  onChange={(e) => setValueInputNewColumn(e.target.value)}
                  onKeyDown={handleKeyDownInputNewColumn}
                />
                <Box sx={{ marginTop: 0.5 }}>
                  <Button
                    sx={{ color: theme.palette.primary.contrastText, backgroundColor: theme.palette.primary.main }}
                    variant="contained"
                    size="small"
                    onClick={handleClickAddList}
                  >
                    Add list
                  </Button>
                  <IconButton>
                    <CloseIcon
                      color="error"
                      onClick={toggleOpenFormCreateColumn}
                    />
                  </IconButton>
                </Box>
              </form>
            </Box>
          )}
        </Box>
      </Box>
    </SortableContext>
  );
}