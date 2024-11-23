import React, { useCallback, useState, useEffect } from 'react';
import { Typography, Paper } from '@mui/material';


import { fetchProjectDetail, resetProjectDetail } from '~/redux/project/projectDetail-slide';
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';

import { useRefreshToken } from '~/utils/useRefreshToken'
import { ToastContainer, toast } from 'react-toastify';




function DashBoard() {
    const { accesstoken } = useSelector(state => state.auth)
    const dispatch = useDispatch();
    const { projectData } = useSelector((state) => state.projectDetail);
    const { projectId } = useParams();

    
    const refreshToken = useRefreshToken();
    useEffect(() => {
        const getProjectDetail = async (token) => {
          try {
            await dispatch(fetchProjectDetail({ accesstoken: token, projectId })).unwrap();
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