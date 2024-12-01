import React, { useEffect } from 'react';

import { fetchProjectDetail, resetProjectDetail } from '~/redux/project/projectDetail-slide';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { useRefreshToken } from '~/utils/useRefreshToken'
import { transformDataBoard } from '~/utils/transformDataBoard'
import Board from './Board';

const BoardsProject = () => {
    ////////////////////////////////
    const dispatch = useDispatch();
    const { projectData } = useSelector((state) => state.projectDetail);
    const { projectId } = useParams();
    const { accesstoken } = useSelector(state => state.auth)

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

    console.log(projectData?.project?.lists);

    const board = transformDataBoard(projectData?.project?.lists);
    console.log(board);
    return (
        <>
            <Board board={board} />
        </>
    );
}

export default BoardsProject;