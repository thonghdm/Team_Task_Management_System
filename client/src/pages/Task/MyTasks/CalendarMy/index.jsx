import React, { useEffect } from 'react'
import { useTheme } from '@mui/material/styles';

import { useDispatch, useSelector } from 'react-redux'
import { getTaskByMemberIDThunk } from '~/redux/project/task-slice/task-inviteUser-slice/index'
import { transformDataCal } from '~/utils/transformDataCal'
import { Box } from '@mui/material';

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
            {duLieuDuAn && duLieuDuAn.length > 0 ?
                <Calendario data={duLieuDuAn} /> :
                (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 300,
                        }}
                    >
                        <img
                            src="https://cdn-icons-png.freepik.com/256/11329/11329073.png"
                            alt="No data available"
                            style={{ maxHeight: '100%', maxWidth: '100%' }}
                        />
                    </Box>
                )
            }
        </>
    );
}

export default CalendarMy;