import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
// import TextEditor from '~/Components/TextEditor';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography } from '@mui/material';

import ProjectDescription from '~/pages/Projects/Content/Overview/ProjectDescription';

const Note = () => {
    const { userData } = useSelector(state => state.auth)
    // useEffect(() => {
    //     const fetchUser = async () => {
    //         setHasFetchedUser(true);
    //         try {
    //             const response = await apiGetOne(accesstoken);
    //             dispatch({
    //                 type: actionTypes.UPDATE_USER_DATA,
    //                 data: { typeLogin: true, userData: response.data.response },
    //             });
    //         } catch (error) {
    //         }
    //     };
    //     fetchUser();
    // }, [hasFetchedUser]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="h5" gutterBottom sx={{fontWeight: 'bold',mt:1}}>
                Project description
            </Typography>
            <ProjectDescription initialContent={userData?.note} context={"descriptionMyTask"} />
        </Box>
    );
};

export default Note;