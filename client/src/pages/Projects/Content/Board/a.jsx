import React, { useState, useMemo } from 'react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  closestCenter
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  horizontalListSortingStrategy
} from '@dnd-kit/sortable';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { Box, Typography, Button, Card, CardContent, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { CSS } from '@dnd-kit/utilities';

const TaskCard = ({ id, content, isDragging }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
  };

  return (
    <Card ref={setNodeRef} style={style} {...attributes} {...listeners} sx={{ mb: 1 }}>
      <CardContent>
        <Typography>{content}</Typography>
      </CardContent>
    </Card>
  );
};

const TaskList = React.memo(({ id, title, tasks, onAddTask }) => {
  const [newTask, setNewTask] = useState('');
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleAddTask = () => {
    if (newTask.trim() !== '') {
      onAddTask(id, newTask);
      setNewTask('');
    }
  };

  return (
    <Box ref={setNodeRef} style={style} {...attributes} {...listeners} sx={{ width: 300, bgcolor: 'grey.200', p: 2, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
        {tasks.map((task) => (
          <TaskCard key={task.id} id={task.id} content={task.content} />
        ))}
      </SortableContext>
      <TextField
        fullWidth
        size="small"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Add a new task"
        sx={{ mt: 2 }}
      />
      <Button startIcon={<AddIcon />} onClick={handleAddTask} fullWidth variant="contained" sx={{ mt: 1 }}>
        Add Task
      </Button>
    </Box>
  );
});

const Board = () => {
  const [lists, setLists] = useState([
    { id: 'list1', title: 'To-Do', tasks: [{ id: 'task1', content: 'Task 1' }] },
    { id: 'list2', title: 'Doing', tasks: [{ id: 'task2', content: 'Task 2' }] },
    { id: 'list3', title: 'Done', tasks: [{ id: 'task3', content: 'Task 3' }] },
    { id: 'list5', title: 'To-Do', tasks: [{ id: 'task5', content: 'Task 5' }] },
    { id: 'list6', title: 'Doing', tasks: [{ id: 'task6', content: 'Task 6' }] },
    { id: 'list7', title: 'Done', tasks: [{ id: 'task7', content: 'Task 7' }] },
  ]);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findListContainingItem = (itemId) => {
    return lists.find((list) =>
      list.id === itemId || list.tasks.some((task) => task.id === itemId)
    );
  };

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
  
    const activeList = findListContainingItem(active.id);
    const overList = findListContainingItem(over.id);
  
    if (activeList && overList) {
      setLists((prevLists) => {
        const activeListIndex = prevLists.findIndex((list) => list.id === activeList.id);
        const overListIndex = prevLists.findIndex((list) => list.id === overList.id);
  
        if (active.id.startsWith('list') && over.id.startsWith('list')) {
          // Moving columns (lists)
          return arrayMove(prevLists, activeListIndex, overListIndex);
        } else {
          // Moving tasks
          const newLists = [...prevLists];
          const activeTaskIndex = activeList.tasks.findIndex((task) => task.id === active.id);
          const [movedTask] = newLists[activeListIndex].tasks.splice(activeTaskIndex, 1);
  
          if (activeList.id === overList.id) {
            // Moving within the same list
            const overTaskIndex = over.id.startsWith('list') || !over.id
              ? newLists[overListIndex].tasks.length // If over a list or at the end, drop at the end
              : newLists[overListIndex].tasks.findIndex((task) => task.id === over.id);
  
            newLists[overListIndex].tasks.splice(overTaskIndex, 0, movedTask);
          } else {
            // Moving to a different list
            const overTaskIndex = over.id.startsWith('list') || !over.id
              ? newLists[overListIndex].tasks.length // Drop at the end if over a list or empty space
              : newLists[overListIndex].tasks.findIndex((task) => task.id === over.id);
  
            newLists[overListIndex].tasks.splice(overTaskIndex, 0, movedTask);
          }
  
          return newLists;
        }
      });
    }
    setActiveId(null);
  };
  

  const handleAddTask = (listId, content) => {
    setLists((prevLists) =>
      prevLists.map((list) =>
        list.id === listId
          ? { ...list, tasks: [...list.tasks, { id: `task${Date.now()}`, content }] }
          : list
      )
    );
  };

  const handleAddList = () => {
    const newList = {
      id: `list${Date.now()}`,
      title: `New List ${lists.length + 1}`,
      tasks: []
    };
    setLists([...lists, newList]);
  };

  const getActiveItem = useMemo(() => {
    if (!activeId) return null;
    const activeList = findListContainingItem(activeId);
    if (activeList) {
      if (activeList.id === activeId) {
        return <TaskList id={activeList.id} title={activeList.title} tasks={activeList.tasks} onAddTask={handleAddTask} />;
      } else {
        const activeTask = activeList.tasks.find(task => task.id === activeId);
        if (activeTask) {
          return <TaskCard id={activeTask.id} content={activeTask.content} isDragging={true} />;
        }
      }
    }
    return null;
  }, [activeId, lists]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToWindowEdges]}
    >
      <Box sx={{ display: 'flex', gap: 2, p: 2, bgcolor: 'primary.main', height: 'auto', overflowX: 'auto' }}>
        <SortableContext items={lists.map(list => list.id)} strategy={horizontalListSortingStrategy}>
          {lists.map((list) => (
            <TaskList
              key={list.id}
              id={list.id}
              title={list.title}
              tasks={list.tasks}
              onAddTask={handleAddTask}
            />
          ))}
        </SortableContext>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddList}
          sx={{ height: 'fit-content', bgcolor: 'rgba(255,255,255,0.3)' }}
        >
          Add another list
        </Button>
      </Box>
      <DragOverlay>{getActiveItem}</DragOverlay>
    </DndContext>
  );
};

export default Board;