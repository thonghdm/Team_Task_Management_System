import React, { useEffect, useState } from 'react'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Box } from '@mui/material';
//
import Card from './Card/Card';
import ChangeList from '~/pages/Projects/Content/TaskBoard/ChangeList';

export default function Cards({ tasks = [] }) {

  ////////////////////////////////openTaskDetail
  const [showNameMenu, setShowNameMenu] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleOpenNameMenu = (task) => {
    setSelectedTask(task);
    setShowNameMenu(true);
  };
  const handleCloseNameMenu = () => {
    setShowNameMenu(false);
    setSelectedTask(null);
  };

  const handleNameClick = (taskId) => {
    handleOpenNameMenu(taskId);
  };

  const handleCardClick = (taskId) => {
    handleNameClick(taskId)
  };
  ////////////////////////////////////////////////////////////////


  return (
    <>
      <SortableContext items={tasks.map(card => card._id)} strategy={verticalListSortingStrategy}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            padding: '0 2px',
            margin: '0 2px',
            overflowX: 'hidden',
            overflowY: 'auto',
            //   maxHeight: (theme) =>
            //     `calc(${theme.customTrello.boardContentHeight} - ${theme.spacing(
            //       5
            //     )} - ${theme.customTrello.headerCardHeight} - ${
            //       theme.customTrello.footerCardHeight
            //     })`,
            //   '&::-webkit-scrollbar': {
            //     width: '6px',
            //     height: '6px'
            //   }
          }}
        >
          {tasks?.map((card) => (
            <Card card={card} key={card._id} onRowClick={() => handleCardClick(card._id)} />
          ))}
        </Box>
      </SortableContext>
      {showNameMenu && selectedTask && (
        <ChangeList open={showNameMenu} onClose={handleCloseNameMenu} taskId={selectedTask} />
      )}
    </>
  );
}
