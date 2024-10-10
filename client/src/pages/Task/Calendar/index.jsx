import React, { useState } from 'react';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

import duLieuDuAn from '~/pages/Task/Calendar/duLieuDuAn';
import CustomCalendar from './CustomCalendar';
import useStyles from '~/pages/Task/Calendar/useStyles';
import { useTheme } from '@mui/material/styles';

import '~/pages/Task/Calendar/styles.css';
const DragAndDropCalendar = withDragAndDrop(Calendar);
const localizer = momentLocalizer(moment);



function Calendario() {
    const theme = useTheme();
    const classes = useStyles(theme);
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
    };

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
                    eventPropGetter={eventStyle}
                    components={{
                        toolbar: CustomCalendar,
                    }}
                />

            </div>
        </div>
    );
}

export default Calendario;