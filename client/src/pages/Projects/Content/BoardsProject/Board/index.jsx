import { Box } from '@mui/material';
import {
  DndContext,
  useSensor,
  useSensors,
  // MouseSensor,
  // TouchSensor,
  DragOverlay,
  defaultDropAnimationSideEffects,
  pointerWithin,
  closestCorners,
  getFirstCollision
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useCallback, useEffect, useState, useRef } from 'react';
import { cloneDeep, isEmpty, map } from 'lodash';

//
import { MouseSensor, TouchSensor } from '~/pages/Projects/Content/BoardsProject/Board/customLibs/DndKitSensor';
import Columns from './Columns/Columns';
import Column from './Columns/Column/Column';
import Card from './Columns/Column/Cards/Card/Card';
import { generatePlaceholderCard } from '~/utils/formatters';

import { useTheme } from '@mui/material';

// import { moveColumns } from '~/redux/thunk/board';
// import {
//   moveCardsInTheSameColumn,
//   moveCardTodifferentColumn
// } from '~/redux/thunk/column';


import { updateProjectDetailThunk } from '~/redux/project/projectDetail-slide';
////
import { fetchProjectDetail, resetProjectDetail } from '~/redux/project/projectDetail-slide';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'

import { useRefreshToken } from '~/utils/useRefreshToken'
import { ToastContainer, toast } from 'react-toastify';

import { transformDataBoard } from '~/utils/transformDataBoard';
import { reorderLists } from '~/utils/sort';
import { updateList } from '~/apis/Project/listService';
import { createAuditLog_project } from '~/redux/project/auditlog-slice/auditlog_project';


const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
};

const Board = ({ board }) => {
  const theme = useTheme();
  // MapOrdered
  const [orderedColumnsState, setOrderedColumnsState] = useState([]);

  const lastOverId = useRef(null);

  // Tại 1 thời điểm chỉ có card hoặc column
  const [activeDragItemId, setActiveDragItemId] = useState(null);
  const [activeDragItemType, setActiveDragItemType] = useState(null);
  const [activeDragItemData, setActiveDragItemData] = useState(null);
  const [activeColumnBeforeRerender, setActiveColumnBeforeRerender] =
    useState(null);

  useEffect(() => {
    const boardSort = reorderLists(board);
    const boardList = transformDataBoard(boardSort?.lists);
    setOrderedColumnsState(boardList?.lists);
  }, [board]);

  ////////////////////////// move
  const dispatch = useDispatch();
  const { projectId } = useParams();
  const { accesstoken, userData } = useSelector(state => state.auth)
  const refreshToken = useRefreshToken();
  ////////////////////////// moveColumns //////////////////////////
  const moveLists = (orderedArrMove) => {
    try {
      const dataMove = {
        listId: orderedArrMove
      };
      const moveListsProject = async (token) => {
        try {
          const resultAction = await dispatch(updateProjectDetailThunk({
            accesstoken: token,
            projectId: projectId,
            projectData: dataMove
          }));
          if (updateProjectDetailThunk.rejected.match(resultAction)) {
            if (resultAction.payload?.err === 2) {
              const newToken = await refreshToken();
              return moveListsProject(newToken);
            }
            throw new Error('Move Lists Project failed');
          }
          await dispatch(fetchProjectDetail({ accesstoken: token, projectId }));
        } catch (error) {
          throw error;
        }
      };
      moveListsProject(accesstoken);
    }
    catch (error) {
      throw error;
    }
  };

  ////////////////////////////// tasks list //////////////////////////////
  const moveCardsInTheSameColumn = (list_id, orderedArrMove) => {
    const listData = {
      task_id: orderedArrMove
    };
    const moveCards = async (token) => {
      try {
        const response = await updateList(token, list_id, listData);
        const res = await dispatch(createAuditLog_project({
          accesstoken: token,
          data: {
            project_id: projectId,
            action: 'Update',
            entity: 'List',
            user_id: userData?._id,
            list_id: response?.list?._id,
          }
        })
        )
        await dispatch(fetchProjectDetail({ accesstoken: token, projectId }))
      } catch (error) {
        if (error.response?.status === 401) {
          const newToken = await refreshToken();
          return moveCards(newToken);
        }
        throw error;
      }
    };
    try {
      moveCards(accesstoken);
    } catch (error) {
      throw error;
    }
  }
  
  // Tìm column đang chứa cardId (làm dữ liệu tasks rồi mới làm cho orderCard)
  const findColumnByCardId = (cardId) => {
    return orderedColumnsState.find((column) =>
      column?.tasks.map((card) => card._id)?.includes(cardId)
    );
  };

  // Di chuyển card giữa các lists khác nhau
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData,
    triggerFrom
  ) => {
    setOrderedColumnsState((preveColumnsState) => {
      //  Tìm vị trí của overCardIndex (card trong column đích)
      const overCardIndex = overColumn?.tasks.findIndex(
        (card) => card._id === overId
      );

      let newCardIndex;

      const isBelowOverCardOver =
        active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height;

      const modifier = isBelowOverCardOver ? 1 : 0;

      newCardIndex =
        overCardIndex >= 0
          ? overCardIndex + modifier
          : overColumn?.tasks?.length + 1;

      // Clone ra 1 lists để xử lý dữ liệu
      const nextColumns = cloneDeep(preveColumnsState);
      const nextActiveColumn = nextColumns.find(
        (column) => column._id === activeColumn._id
      );
      const nextOverColumn = nextColumns.find(
        (column) => column._id === overColumn._id
      );

      if (nextActiveColumn) {
        // Xóa card dragging ở column active
        nextActiveColumn.tasks = nextActiveColumn?.tasks?.filter(
          (card) => card._id !== activeDraggingCardId
        );

        // Thêm placeholder-card nếu column không có card nào
        if (isEmpty(nextActiveColumn.tasks)) {
          nextActiveColumn.tasks = [generatePlaceholderCard(nextActiveColumn)];
        }

        // Xóa idCard trong task_id sau khi xóa tasks
        nextActiveColumn.task_id = nextActiveColumn.tasks.map(
          (column) => column._id
        );
      }

      if (nextOverColumn) {
        // Xóa cardDragging đã có trong overColumn
        nextOverColumn.tasks = nextOverColumn?.tasks?.filter(
          (card) => card._id !== activeDraggingCardId
        );

        // Thêm cardDragging vào columnOver
        nextOverColumn.tasks = nextOverColumn.tasks.toSpliced(newCardIndex, 0, {
          ...activeDraggingCardData,
          list_id: nextOverColumn._id
        });

        // Xóa placeholder-card đi khi đã có card tồn tại
        nextOverColumn.tasks = nextOverColumn.tasks.filter(
          (card) => !card.FE_placeholderCard
        );

        // Cập nhật idCard trong task_id sau khi xóa tasks
        nextOverColumn.task_id = nextOverColumn.tasks.map(
          (column) => column._id
        );
      }

      // if (triggerFrom === 'handleDragEnd') {
      //   // Call api drag card to different column
      //   dispatch(
      //     moveCardTodifferentColumn({
      //       currentCardId: activeDraggingCardId,
      //       prevColumnId: activeColumnBeforeRerender._id,
      //       nextColumnId: nextOverColumn._id,
      //       dndOrderedColumn: nextColumns
      //     })

      //   );
      // }

      return nextColumns;
    });
  };

  // Event handlers
  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active?.id);
    setActiveDragItemType(
      event?.active?.data?.current?.list_id
        ? ACTIVE_DRAG_ITEM_TYPE.CARD
        : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    );
    setActiveDragItemData(event?.active?.data?.current);

    if (event?.active?.id) {
      setActiveColumnBeforeRerender(findColumnByCardId(event?.active?.id));
    }
  };

  const handleDragOver = (event) => {
    const { active, over } = event;

    // Nếu là column thì không làm gì cả
    if (ACTIVE_DRAG_ITEM_TYPE.COLUMN === activeDragItemType) return;

    // không làm gì khi không có over hoặc active
    if (!over || !active) return;

    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCardData }
    } = active;
    const { id: overId } = over;

    const activeColumn = findColumnByCardId(activeDraggingCardId);
    const overColumn = findColumnByCardId(overId);

    if (!activeColumn || !overColumn) return;

    if (activeColumn?._id !== overColumn?._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData,
        'handleDragOver'
      );
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    // không làm gì khi không có over hoặc active
    if (!over || !active) return;

    // Card
    if (ACTIVE_DRAG_ITEM_TYPE.CARD === activeDragItemType) {
      const {
        id: activeDraggingCardId,
        data: { current: activeDraggingCardData }
      } = active;
      const { id: overId } = over;

      const activeColumn = findColumnByCardId(activeDraggingCardId);
      const overColumn = findColumnByCardId(overId);

      if (!activeColumn || !overColumn) return;

      if (activeColumnBeforeRerender._id !== overColumn._id) {
        moveCardBetweenDifferentColumns(
          overColumn,
          overId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData,
          'handleDragEnd'
        );
      } else {
        const oldIndex = activeColumnBeforeRerender?.tasks?.findIndex(
          (card) => card._id === activeDragItemId
        );
        const newIndex = overColumn?.tasks?.findIndex(
          (card) => card._id === overId
        );

        const orderedArrMove = arrayMove(
          activeColumnBeforeRerender.tasks,
          oldIndex,
          newIndex
        );
        setOrderedColumnsState((prevColumns) => {
          const cloneColumns = cloneDeep(prevColumns);

          // Find trả về 1 phần tử thỏa mãn điều kiện (tham chiếu)
          const targetColumns = cloneColumns.find(
            (column) => column._id === overColumn._id
          );
          targetColumns.tasks = orderedArrMove;
          targetColumns.task_id = orderedArrMove?.map(
            (column) => column._id
          );
          return cloneColumns;
        });
        moveCardsInTheSameColumn(activeColumnBeforeRerender._id, orderedArrMove);
      }
    }

    // Column
    if (
      ACTIVE_DRAG_ITEM_TYPE.COLUMN === activeDragItemType &&
      active.id !== over.id
    ) {
      const oldIndex = orderedColumnsState.findIndex(
        (column) => column._id === active.id
      );
      const newIndex = orderedColumnsState.findIndex(
        (column) => column._id === over.id
      );

      // Array moved
      const orderedArrMove = arrayMove(orderedColumnsState, oldIndex, newIndex);

      // Vẫn có bước này để ứng dụng không bị nhấp nhấy.
      setOrderedColumnsState(orderedArrMove);
      // Call API update datas
      moveLists(orderedArrMove);

    }

    // Những State này chỉ dùng 1 lần khi kéo column hoặc kéo card nên set lại null để thực hiện lần kéo tiếp theo
    setActiveDragItemId(null);
    setActiveDragItemType(null);
    setActiveDragItemData(null);
    setActiveColumnBeforeRerender(null);
  };

  // Animation khi thả SortItem giữ chổ cho đến khi SortItem quay lại
  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5'
        }
      }
    })
  };

  // Sensors
  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      distance: 10
    }
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 500 }
  });
  const sensors = useSensors(mouseSensor, touchSensor);

  // Custom thuật toán phát hiện va chạm (khi dùng closestCorners thì bị flickering khi để con trỏ ở giữa)
  // Mục đích của thuật toán phát hiện va chạm là trả về overId
  const collisionDetectionStrategy = useCallback(
    (args) => {
      // Nếu là COLUMN thì vẫn sử dụng thuật toán va chạm closestCorners
      if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
        return closestCorners({ ...args });
      }

      // Khi là tasks thì sử dụng pointerWithin , custom lại thuật toán va chạm
      // Tìm các điểm giao nhau với con trỏ
      const pointerIntersections = pointerWithin(args);
      if (!pointerIntersections?.length > 0) return;

      let overId = getFirstCollision(pointerIntersections, 'id');
      if (overId) {
        const checkColumn = orderedColumnsState.find(
          (col) => col._id === overId
        );

        // Đoạn này nếu overId là column thì tìm card gần nhất trong column để lấy id
        if (checkColumn) {
          overId = closestCorners({
            ...args,
            droppableContainers: args.droppableContainers?.filter(
              (container) =>
                container.id !== overId &&
                checkColumn?.task_id?.includes(container.id)
            )
          })[0]?.id;
        }

        lastOverId.current = overId;

        return [{ id: overId }];
      }
      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [activeDragItemType, orderedColumnsState]
  );

  return (
    <DndContext
      sensors={sensors}
      // Thuật toán phát hiện va chạm
      collisionDetection={collisionDetectionStrategy}
      // collisionDetection={closestCorners}

      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
    >
      <Box
        sx={{
          width: '100%',
          // height: (theme) => theme.customTrello.boardContentHeight,
          // marginTop: (theme) => theme.customTrello.appBarHeight,
          bgcolor: theme.palette.background.paper,
          paddingTop: '.7rem',
          paddingBottom: '.7rem',
          maxWidth: '100vw',
          overflowX: 'auto',
          mt: 2,
          borderRadius: '10px',
        }}
      >
        <Columns lists={orderedColumnsState} />
        {/* DragOverlay đặt ngang cấp với Sortable và có item bên trong là tất cả SortItem */}
        <DragOverlay dropAnimation={dropAnimation}>
          {activeDragItemId &&
            activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN ? (
            <Column column={activeDragItemData} />
          ) : null}
          {activeDragItemId &&
            activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD ? (
            <Card card={activeDragItemData} />
          ) : null}
        </DragOverlay>
      </Box>
    </DndContext>
  );
};

export default Board;
