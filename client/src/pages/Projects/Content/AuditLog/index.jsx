import React, { useState } from 'react';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Divider,
    Chip
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    Task as TaskIcon,
    Label as LabelIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { fetchProjectDetail, resetProjectDetail } from '~/redux/project/projectDetail-slide';
import { useRefreshToken } from '~/utils/useRefreshToken'

dayjs.extend(relativeTime);


const actionIcons = {
    'Create': { icon: <AddIcon />, color: 'success.main' },
    'Update': { icon: <EditIcon />, color: 'primary.main' },
    'Delete': { icon: <DeleteIcon />, color: 'error.main' },
    'Leave': { icon: <TaskIcon />, color: 'warning.main' },
    'Add': { icon: <AddIcon />, color: 'success.main' },
};

const getActionIcon = (action, entity) => {
    const defaultIcon = <TaskIcon />;
    const mapping = actionIcons[action] || { icon: defaultIcon, color: 'text.secondary' };
    return mapping;
};

const AuditLog = ({ auditLogs }) => {
    const dispatch = useDispatch();
    const [visibleLogs, setVisibleLogs] = useState(10); // Initially show 10 logs
    const { projectData } = useSelector((state) => state.projectDetail);
    const { projectId } = useParams();
    const { accesstoken } = useSelector(state => state.auth);
    const refreshToken = useRefreshToken();
    useEffect(() => {
        const getProjectDetail = async (token) => {
            try {
                const project = await dispatch(fetchProjectDetail({ accesstoken: token, projectId })).unwrap();
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
    const loadMoreLogs = () => {
        setVisibleLogs(prev => prev + 10);
    };

    if (!projectData?.project?.audit_logs) {
        return (
            <Box textAlign="center" p={2}>
                <Typography variant="body2" color="text.secondary">
                    No activity logs found
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            <List>
                {projectData?.project?.audit_logs?.slice().reverse().map((audit_log, index) => {
                    const { icon, color } = getActionIcon(audit_log.action, audit_log.entity);
                    return (
                        <React.Fragment key={audit_log?._id || index}>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar
                                        sx={{
                                            bgcolor: color,
                                            width: 40,
                                            height: 40
                                        }}
                                    >
                                        {icon}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Typography variant="body1">
                                                {audit_log.user_details?.displayName || 'Unknown User'}
                                            </Typography>
                                            <Chip
                                                label={audit_log.action}
                                                size="small"
                                                color={
                                                    audit_log.action === 'Create' ? 'success' :
                                                        audit_log.action === 'Add' ? 'success' :
                                                            audit_log.action === 'Update' ? 'primary' :
                                                                audit_log.action === 'Delete' ? 'error' :
                                                                    audit_log.action === 'Leave' ? 'warning' :
                                                                    'default'
                                                }
                                            />
                                            <Typography variant="body2" color="text.secondary">
                                                {audit_log.entity}

                                            </Typography>
                                            {audit_log.task_details?.task_name && (
                                                <Typography variant="body2" color="success.main">
                                                    {` ${audit_log.task_details.task_name}`}
                                                </Typography>
                                            )}
                                            {audit_log.list_details?.list_name && (
                                                <Typography variant="body2" color="info.main">
                                                    {` ${audit_log.list_details.list_name}`}
                                                </Typography>
                                            )}
                                            {audit_log.old_value && (
                                                <Box display="flex" flexDirection="column" gap={1}>
                                                    <Box display="flex" gap={1} >
                                                        {audit_log.old_value.split(',').map((username, index) => (
                                                            <Chip
                                                                key={index}
                                                                label={username.trim()}  // Hiển thị tên người dùng
                                                                size="small"
                                                                color="secondary"
                                                                variant="outlined"
                                                                sx={{ margin: 0.5 }}  // Điều chỉnh khoảng cách giữa các label
                                                            />
                                                        ))}
                                                    </Box>
                                                </Box>
                                            )}
                                        </Box>
                                    }
                                    secondary={
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                {dayjs(audit_log.createdAt).fromNow()}
                                            </Typography>
                                        </Box>
                                    }
                                />
                            </ListItem>

                        </React.Fragment>
                    );
                })}
            </List>
        </Box>
    );
};

export default AuditLog;