import React, { useCallback, useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import Calendario from '~/Components/Calendar';
import duLieuDuAn from '~/Components/Calendar/duLieuDuAn';
import { Paper } from '@mui/material';

import { fetchProjectDetail, resetProjectDetail } from '~/redux/project/projectDetail-slide';
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';

import { transformDataCalProject } from '~/utils/transformDataCalProject';

function Calendar() {
    ////
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

    const data = transformDataCalProject(projectData?.project?.lists);  
    ////
    return (
        <Paper elevation={3} sx={{ mt: 2, backgroundColor: 'background.default', color: 'text.primary' }}>
            <Calendario duLieuDuAn={data} />
        </Paper>
    );
}

export default Calendar;