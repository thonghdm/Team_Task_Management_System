import React, { useEffect, useState } from 'react';

import { fetchProjectDetail, resetProjectDetail } from '~/redux/project/projectDetail-slide';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { useRefreshToken } from '~/utils/useRefreshToken'
import Board from './Board';

const BoardsProject = () => {
    ////////////////////////////////
    const dispatch = useDispatch();
    const { projectData } = useSelector((state) => state.projectDetail);
    const { projectId } = useParams();
    const { accesstoken } = useSelector(state => state.auth)

    const [project, setProject] = useState(projectData?.project);

    useEffect(() => {
        setProject(projectData?.project);
    }, [projectData]);

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
                throw error;
            }
        };

        getProjectDetail(accesstoken);
        return () => {
            dispatch(resetProjectDetail());
        };
    }, [dispatch, projectId, accesstoken]);

    return (
        <>
            <Board board={project} />
        </>
    );
}

export default BoardsProject;