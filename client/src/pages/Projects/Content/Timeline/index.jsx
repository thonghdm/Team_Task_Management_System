import React from 'react';
import { styled } from '@mui/material/styles';
import { Typography, Paper } from '@mui/material';
import Scheduler from '~/pages/Projects/Content/Timeline/Schedulers';
import '~/pages/Projects/Content/Timeline/styles.css';

const StyledSchedulerFrame = styled('div')(({ theme }) => ({
    position: 'relative',
    minHeight: '70vh',
    width: '79vw',
    [theme.breakpoints.down('md')]: {
        width: '70vw',
        height: '50vh',
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
    '& .btlFdD': {
        backgroundColor: `${theme.palette.background.paper}`, // Corrected spelling and added string for the color
        borderRadius: '15px',
    },

    '& .bQCeUz div': {
        // backgroundColor: `${theme.palette.secondary.main}`, // Màu nền của thẻ select
    },

    '& .bFYVFX': {
        color: `${theme.palette.secondary.main}`, // Màu nền của thẻ select
    },
   

}));


function Timeline() {
    return (
        <Paper
            elevation={3}
            sx={{
                mt: 2,

            }}
        >
            <StyledSchedulerFrame className="scrollable aETZL">
                <Scheduler />
            </StyledSchedulerFrame>
        </Paper>
    );
}

export default Timeline;