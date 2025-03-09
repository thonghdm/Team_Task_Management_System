import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
// import TextEditor from '~/Components/TextEditor';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography } from '@mui/material';
import { apiGetOne } from '~/apis/User/userService'

import ProjectDescription from '~/pages/Projects/Content/Overview/ProjectDescription';

const Note = () => {
    const { userData, accesstoken } = useSelector(state => state.auth)
    const [setdata, setData] = useState();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await apiGetOne(accesstoken);
                setData(response.data.response);
                dispatch({
                    type: actionTypes.UPDATE_USER_DATA,
                    data: { typeLogin: true, userData: response.data.response },
                });
            } catch (error) {
            }
        };
        fetchUser();
    }, [accesstoken, userData]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mt: 1 }}>
                Note
            </Typography>
            <ProjectDescription initialContent={setdata?.note} context={"descriptionMyTask"} />
        </Box>
    );
};

export default Note;