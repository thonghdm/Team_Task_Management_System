import React, { useState } from 'react';
import { Modal, Box, Button, TextField, Collapse, IconButton, Typography } from '@mui/material';
import { ColorPicker } from '@mui/lab';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const EventModal = ({ evento, onClose, onDelete, onUpdate }) => {
    const [editedEvent, setEditedEvent] = useState({ ...evento });
    const [collapsed, setCollapsed] = useState(true);
    const theme = useTheme();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedEvent({ ...editedEvent, [name]: value });
    };

    const handleColorChange = (color) => {
        setEditedEvent({ ...editedEvent, color: color.hex });
    };

    const handleStartDateChange = (e) => {
        const startDate = new Date(e.target.value);
        if (startDate <= editedEvent.end) {
            setEditedEvent({ ...editedEvent, start: startDate });
        }
    };

    const handleEndDateChange = (e) => {
        const endDate = new Date(e.target.value);
        if (endDate >= editedEvent.start) {
            setEditedEvent({ ...editedEvent, end: endDate });
        }
    };

    const handleDelete = () => {
        onDelete(evento.id);
    };

    const handleUpdate = () => {
        onUpdate(editedEvent);
        onClose();
    };

    const adjustDate = (date) => {
        const adjustedDate = new Date(date);
        adjustedDate.setHours(adjustedDate.getHours() - 3);
        return adjustedDate.toISOString().slice(0, -8);
    };

    return (
        <Modal open={true} onClose={onClose}>
            <Box sx={{ p: 4, borderRadius: 112, maxWidth: 500, mx: 'auto', my: 5 }}>
                <Typography variant="h6">{editedEvent.title}</Typography>
                <TextField
                    fullWidth
                    label="Título"
                    name="title"
                    value={editedEvent.title}
                    onChange={handleInputChange}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Descrição"
                    name="desc"
                    value={editedEvent.desc}
                    onChange={handleInputChange}
                    multiline
                    rows={3}
                    margin="normal"
                />
                <Button
                    variant="text"
                    onClick={() => setCollapsed(!collapsed)}
                    startIcon={collapsed ? <ExpandMore /> : <ExpandLess />}
                >
                    {collapsed ? 'Mostrar Detalhes' : 'Ocultar Detalhes'}
                </Button>
                <Collapse in={!collapsed}>
                    <TextField
                        fullWidth
                        type="datetime-local"
                        label="Início"
                        name="start"
                        value={adjustDate(editedEvent.start)}
                        onChange={handleStartDateChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        type="datetime-local"
                        label="Fim"
                        name="end"
                        value={adjustDate(editedEvent.end)}
                        onChange={handleEndDateChange}
                        margin="normal"
                    />
                    <ColorPicker
                        label="Cor"
                        value={editedEvent.color}
                        onChange={handleColorChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Tipo"
                        name="tipo"
                        value={editedEvent.tipo}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                </Collapse>
                <Box display="flex" justifyContent="space-between" mt={3}>
                    <Button variant="outlined" color="error" onClick={handleDelete}>
                        Apagar
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleUpdate}>
                        Salvar Alterações
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default EventModal;
