import React, { useCallback, useState, useEffect } from 'react';
import { Typography, Paper } from '@mui/material';


import { fetchProjectDetail, resetProjectDetail } from '~/redux/project/projectDetail-slide';
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';





function DashBoard() {
    const { accesstoken } = useSelector(state => state.auth)
    const dispatch = useDispatch();
    const { projectData } = useSelector((state) => state.projectDetail);
    const { projectId } = useParams();
    useEffect(() => {
        dispatch(fetchProjectDetail({ accesstoken, projectId }));
        return () => {
            dispatch(resetProjectDetail());
        };
    }, [dispatch, projectId, accesstoken]);

    // console.log(projectData?.project?.lists)
    return (
        <Paper
            elevation={3}
            sx={{
                mt: 2,

            }}
        >
            <Typography
                variant="h4"
                sx={{
                    textAlign: 'center',
                    mt: 2,
                    mb: 2,
                }}
            >
                DashBoard
            </Typography>
        </Paper>
    );
}

export default DashBoard;