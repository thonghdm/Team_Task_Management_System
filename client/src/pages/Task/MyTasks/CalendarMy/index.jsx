import React, { useEffect } from 'react'
import { useTheme } from '@mui/material/styles';

import { useDispatch, useSelector } from 'react-redux'
import { getTaskByMemberIDThunk } from '~/redux/project/task-slice/task-inviteUser-slice/index'
import { transformDataCal } from '~/utils/transformDataCal'

import Calendario from '~/Components/Calendar';

function CalendarMy() {
    const theme = useTheme();



    ////
    const dispatch = useDispatch()
    const { accesstoken, userData } = useSelector(state => state.auth)
    const { success } = useSelector(state => state.taskInviteUser)
    useEffect(() => {
        dispatch(getTaskByMemberIDThunk({ accesstoken, memberID: userData?._id }));
    }, [dispatch, userData?._id, accesstoken]);

    const duLieuDuAn = success ? (transformDataCal(success)) : [];

    return (
        <>
            <Calendario duLieuDuAn={duLieuDuAn} />
        </>
    );
}

export default CalendarMy;