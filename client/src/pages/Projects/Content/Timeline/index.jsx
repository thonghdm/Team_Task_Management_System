import React, { useCallback, useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Typography, Paper } from '@mui/material';
import Scheduler from '~/pages/Projects/Content/Timeline/Schedulers';
import '~/pages/Projects/Content/Timeline/styles.css';


import { fetchProjectDetail, resetProjectDetail } from '~/redux/project/projectDetail-slide';
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';

import { convertedDataTimeline } from '~/utils/convertedDataTimeline';
import { useRefreshToken } from '~/utils/useRefreshToken'
import { ToastContainer, toast } from 'react-toastify';

const StyledSchedulerFrame = styled('div')(({ theme }) => ({
    position: 'relative',
    minHeight: '86vh',
    width: '81vw',
    [theme.breakpoints.down('md')]: {
        width: '70vw',
        height: '86vh',
    },
    '&.scrollable': {
        overflowY: 'auto',
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgb(212, 232, 223) transparent', // Màu của thanh cuộn
    },
    // '& .drnpen': {
    //     backgroundColor: `${theme.palette.background.paper}`, // Corrected spelling and added string for the color
    // },
    '& .dKqvNc': {
        backgroundColor: `${theme.palette.background.paper}`, // Corrected spelling and added string for the color
    },
    '& .hyJmLo ': {
        backgroundColor: `${theme.palette.background.paper}`, // Corrected spelling and added string for the color
    },
    '& .kKdpkB': {
        backgroundColor: `${theme.palette.background.paper}!important`, // Màu nền của thẻ select khi hover
        zIndex: 10,
    },
    '& .fLoswr ': {
        backgroundColor: `${theme.palette.background.paper}`, // Corrected spelling and added string for the color
        borderRadius: '15px',
    },
    '& .btlFdD, .cBSAIz, .eFJouK': {
        backgroundColor: `${theme.palette.background.paper}`, // Corrected spelling and added string for the color
        borderRadius: '15px',
    },

    '& .bQCeUz div': {
        // backgroundColor: `${theme.palette.secondary.main}`, // Màu nền của thẻ select
    },

    '& .bFYVFX,.fMRhlw': {
        color: `${theme.palette.secondary.main}`, // Màu nền của thẻ select
    },
    


}));


function Timeline() {
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

    const dataScheduler = convertedDataTimeline(projectData?.project?.lists);
    // console.log(projectData?.project?.lists)
    return (
        <Paper
            elevation={3}
            sx={{
                mt: 2,

            }}
        >
            <StyledSchedulerFrame className="scrollable aETZL">
                {projectData && <Scheduler dataScheduler={dataScheduler} />}
            </StyledSchedulerFrame>
        </Paper>
    );
}

export default Timeline;