import React, { useEffect, useState, useCallback } from 'react'
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

import duLieuDuAn from '~/Components/Calendar/duLieuDuAn';

import CustomCalendar from './CustomCalendar';
import useStyles from '~/Components/Calendar/useStyles';
import { useTheme } from '@mui/material/styles';

import '~/Components/Calendar/styles.css';
const DragAndDropCalendar = withDragAndDrop(Calendar);
const localizer = momentLocalizer(moment);

import { useDispatch, useSelector } from 'react-redux'
import { getTaskByMemberIDThunk } from '~/redux/project/task-slice/task-inviteUser-slice/index'
import { transformDataCal } from '~/utils/transformDataCal'

import ChangeList from '~/pages/Projects/Content/TaskBoard/ChangeList';


function Calendario({duLieuDuAn}) {
    const theme = useTheme();
    const classes = useStyles(theme);



    ////
    // const dispatch = useDispatch()
    // const { accesstoken, userData } = useSelector(state => state.auth)
    // const { success } = useSelector(state => state.taskInviteUser)
    // useEffect(() => {
    //     dispatch(getTaskByMemberIDThunk({ accesstoken, memberID: userData?._id }));
    // }, [dispatch, userData?._id, accesstoken]);

    // const duLieuDuAn = success ? (transformDataCal(success)) : [];

    const [eventos, setEventos] = useState(duLieuDuAn);
    const [eventosFiltrados, setEventosFiltrados] = useState(duLieuDuAn);
    const eventStyle = (event) => ({
        style: {
            backgroundColor: event.color || theme.palette.primary.main, // Use theme color
        },
    });

    const moverEventos = ({ event, start, end }) => {
        const updatedEvents = eventos.map((evt) =>
            evt.id === event.id ? { ...evt, start: new Date(start), end: new Date(end) } : evt
        );
        setEventos(updatedEvents);
    };

    const handleEventClick = (evento) => {
        console.log(evento); // Placeholder for event click handler
        handleNameClick(evento.id);
    };

    // const onDoubleClickEvent = useCallback((calEvent) => {
    //     console.log("onDoubleClick");
    //     window.clearTimeout(clickRef?.current);
    //     clickRef.current = window.setTimeout(() => {
    //       console.log(calEvent);
    //     }, 250);
    //   }, []);

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
    ////////////////////////////////////////////////////////////////



    return (
        <div className={classes.tela}>
            <div className={classes.calendario}>
                <DragAndDropCalendar
                    defaultDate={moment().toDate()}
                    defaultView='month'
                    events={eventosFiltrados}
                    views={['month', 'week', 'day', 'agenda']}
                    localizer={localizer}
                    resizable
                    onEventDrop={moverEventos}
                    onEventResize={moverEventos}
                    onSelectEvent={handleEventClick}
                    // onDoubleClickEvent={onDoubleClickEvent}
                    eventPropGetter={eventStyle}
                    components={{
                        toolbar: CustomCalendar,
                    }}
                />

            </div>
            {showNameMenu && selectedTask && (
                <ChangeList open={showNameMenu} onClose={handleCloseNameMenu} taskId={selectedTask} />
            )}
        </div>
    );
}

export default Calendario;