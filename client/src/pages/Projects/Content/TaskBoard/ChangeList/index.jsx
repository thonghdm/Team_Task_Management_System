import React, { useState } from 'react';
import {
    Box, Typography, TextField, Button, Avatar, Chip,
    Dialog, DialogTitle, DialogContent, IconButton
} from '@mui/material';
import {
    Close, CalendarToday, Add, MoreHoriz, InsertDriveFile
} from '@mui/icons-material';
import ProjectDescription from '~/pages/Projects/Content/Overview/ProjectDescription';
import CommentList from './CommentList';
import ActivityLog from './ActivityLog';
import DueDatePicker from '~/Components/DueDatePicker';
import { useTheme } from '@mui/material/styles';
import ColorPickerDialog from '~/Components/ColorPickerDialog';
import FileUploadDialog from '~/Components/FileUploadDialog';
import FileManagementDialogs from '~/Components/FileManagementDialogs';
import AddMemberDialog from '~/Components/AddMemberDialog';


const dataProjectDescription = {
    content: `<p>hiiiiii<span style="color: rgb(241, 250, 140);">The goal of this board is to giveof this board is to give people a high level overviof this board is to give people a high level overviof this board is to give people a high level overviof this board is to give people a high level overviof this board is to give people a high level overviof this board is to give people a high level overviof this board is to give people a high level overviof this board is to give people a high level overviof this board is to give people a high level overviof this board is to give people a high level overviof this board is to give people a high level overviof this board is to give people a high level overviof this board is to give people a high level overviof this board is to give people a high level overviof this board is to give people a high level overviof this board is to give people a high level overvi people a high level overview of what's happening throughout the company, with the ability to find details when they want to.&nbsp;Here's how it works</span>...</p>`
};
const mockComments = [
    {
        img: 'https://i.pravatar.cc/300',
        author: "Ku Huh",
        content: "SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSis task! Let's discuss the nis task! Let's discuss the nSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",
        timestamp: "just now"
    },
    {
        img: 'https://i.pravatar.cc/300',
        author: "Jane Doe",
        content: "Great progress on this task! Let's discuss the next steps in our meeting tomorrow.",
        timestamp: "2 hours ago"
    },
    {
        img: 'https://i.pravatar.cc/300',
        author: "John Smith",
        content: "I've uploaded the latest design files to the shared folder. Please review when you have a chance.",
        timestamp: "yesterday"
    },
    {
        img: 'https://i.pravatar.cc/300',
        author: "Alice Johnson",
        content: "Don't forget we have a deadline coming up next week. We should prioritize the remaining tasks.",
        timestamp: "2 days ago"
    },
    {
        img: 'https://i.pravatar.cc/300',
        author: "Bob Wilson",
        content: "I've addressed the issues mentioned in the previous comment. The updated version is now live.",
        timestamp: "3 days ago"
    }
];

const activities = [
    { avatar: "LV", name: "Luyên Lê Văn", action: "created this task", timestamp: "Yesterday at 12:34am" },
    { avatar: "JD", name: "John Doe", action: "updated the description", timestamp: "2 hours ago" },
    // ... more activities
];
const ChangeList = ({ open, onClose, taskId }) => {
    const theme = useTheme();
    const [description, setDescription] = useState(dataProjectDescription.content);
    const [cmt, setCMT] = useState("Write a comment");

    // Show details
    const [showDetails, setShowDetails] = useState(false);
    const toggleDetails = () => {
        setShowDetails((prev) => !prev);
    };
    //

    // Color picker
    const [openColorPicker, setOpenColorPicker] = useState(false);
    const [label, setLabel] = useState({ title: '', color: '' });
    const handleOpenColorPicker = () => setOpenColorPicker(true);
    const handleCloseColorPicker = (color, title) => {
        setOpenColorPicker(false);
        if (color && title) setLabel({ title, color });
    };
    //

    // Add File
    const [openFile, setOpenFile] = useState(false);
    const handleOpenFile = () => setOpenFile(true);
    const handleCloseFile = () => setOpenFile(false);
    //

    // manage file
    const [openManagement, setOpenManagement] = useState(false);
    const handleOpenManagement = () => setOpenManagement(true);
    const handleCloseManagement = () => setOpenManagement(false);
    //

    // add member
    const [openAvt, setOpenAvt] = useState(false);
    const handleOpenAvt = () => setOpenAvt(true);
    const handleCloseAvt = () => setOpenAvt(false);
    //
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md" // loại bỏ giới hạn chiều rộng mặc định
            PaperProps={{
                style: { backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary },
            }}
            className="scrollable"
            sx={{ maxHeight: '800px!important' }}
        >
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">{taskId}</Typography>
                    <IconButton onClick={onClose} sx={{ color: theme.palette.text.primary }}>
                        <Close />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent dividers>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ width: '100px' }}>Assignee</Typography>
                        <Chip
                            avatar={<Avatar sx={{ bgcolor: '#c9b458' }}>LV</Avatar>}
                            label="Luyên Lê Văn"
                            //   onDelete={() => {}}
                            sx={{ bgcolor: 'transparent', border: `1px solid ${theme.palette.text.secondary}` }}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ width: '100px' }}>Projects</Typography>
                        <Chip
                            label="Untitled section"
                            // onDelete={() => {}}
                            sx={{ bgcolor: '#3b82f6', color: theme.palette.text.primary }}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ width: '100px' }}>Lables</Typography>
                        <Chip
                            label="Untitled section"
                            // onDelete={() => {}}
                            sx={{ bgcolor: '#3b82f6', color: theme.palette.text.primary }}
                        />
                        <Box sx={{ marginLeft: 'auto' }}>
                            <Button onClick={handleOpenColorPicker} startIcon={<Add />} sx={{ color: theme.palette.text.primary, textTransform: 'none' }}>
                                Add
                            </Button>
                        </Box>
                        <ColorPickerDialog open={openColorPicker} onClose={handleCloseColorPicker} />
                        {label.title && (
                            <p>Created Label: {label.title} (Color: {label.color})</p>
                        )}
                    </Box>

                    {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ width: '100px' }}>Due date</Typography>
                        <Chip
                            icon={<CalendarToday fontSize="small" />}
                            label="Oct 25"
                            onDelete={() => { }}
                            sx={{ bgcolor: 'transparent', border: '1px solid #555' }}
                        />
                    </Box> */}
                    <DueDatePicker lableDate={"Due Date"} />


                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography sx={{ width: '100px' }}>Attachments</Typography>
                            <Box sx={{ marginLeft: 'auto' }}>
                                <Button onClick={handleOpenFile} startIcon={<Add />} sx={{ color: theme.palette.text.primary, textTransform: 'none' }}>
                                    Add
                                </Button>
                            </Box>
                            <FileUploadDialog open={openFile} onClose={handleCloseFile} />
                        </Box>
                        <Box sx={{ ml: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <InsertDriveFile sx={{ color: theme.palette.text.primary }} />
                                    <Box>
                                        <Typography sx={{ color: theme.palette.text.primary }}>image.png</Typography>
                                        <Typography sx={{ color: theme.palette.text.secondary, fontSize: '0.8rem' }}>Added May 28, 2018, 9:47 AM</Typography>
                                    </Box>
                                </Box>
                            </Box>
                            <IconButton>
                                <MoreHoriz onClick={handleOpenManagement} sx={{ color: theme.palette.text.primary }} />
                            </IconButton>
                            <FileManagementDialogs open={openManagement} onClose={handleCloseManagement} />
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography>Description</Typography>
                        <ProjectDescription initialContent={description} />
                    </Box>


                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography sx={{ width: '100px' }}>Activity</Typography>
                            <Box sx={{ marginLeft: 'auto' }}>
                                <Button
                                    sx={{ color: theme.palette.text.primary, textTransform: 'none' }}
                                    onClick={toggleDetails}
                                >
                                    {showDetails ? 'Hide details' : 'Show details'}
                                </Button>
                            </Box>
                        </Box>
                        {showDetails && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                                    <ActivityLog activitys={activities} />
                                </Typography>
                            </Box>
                        )}
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography>Comments</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                        <Avatar sx={{ bgcolor: '#c9b458', width: 30, height: 30, fontSize: '0.8rem' }}>LV</Avatar>
                        <Box
                            sx={{
                                border: `1px solid ${theme.palette.background.paper}`, // Viền
                                backgroundColor: theme.palette.background.default, // Màu nền (tùy chỉnh theo yêu cầu)
                                borderRadius: '8px',        // Bo góc viền
                                padding: 2,                 // Thêm khoảng cách giữa nội dung và viền
                                width: '100%',
                                padding: "8px!important"            // Chiều rộng
                            }}
                        >
                            <ProjectDescription initialContent={cmt} />
                        </Box>
                    </Box>

                    <CommentList comments={mockComments} />

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <Typography variant="caption">Collaborators</Typography>
                        <Avatar sx={{ bgcolor: '#c9b458', width: 25, height: 25, fontSize: '0.7rem' }}>LV</Avatar>
                        <Avatar onClick={handleOpenAvt} sx={{ bgcolor: theme.palette.background.default,color: theme.palette.text.primary, width: 25, height: 25, fontSize: '0.7rem', cursor:'pointer' }}>+</Avatar>
                        <Button sx={{ color: theme.palette.text.primary, textTransform: 'none', ml: 'auto' }}>Leave task</Button>
                    </Box>
                    <AddMemberDialog open={openAvt} onClose={handleCloseAvt} />
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default ChangeList;