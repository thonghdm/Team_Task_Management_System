import authReducer from "./authReducer";
import { combineReducers } from 'redux'
import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist'
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";
import projectsSlice from '~/redux/project/projectArray-slice';
import projectDetailSlice from '~/redux/project/projectDetail-slide';
import memberSlice from '~/redux/member/member-slice';
import inviteSlice from '~/redux/project/projectRole-slice/index';
import memberProjectSlice from '~/redux/project/projectRole-slice/memberProjectSlice'

import taskSlice from '~/redux/project/task-slice/index';
import commentUserSlice from '~/redux/project/comment-slice/commentUser-slice/index';
import commentSlice from '~/redux/project/comment-slice/index';
import labelSlice from '~/redux/project/label-slice/index';
import fileSlice from '~/redux/project/uploadFile-slice/index';

import projectThunkSlice from '~/redux/project/project-slice/index';
// Cấu hình cho persist
const commonConfig = {
    storage,
    stateReconciler: autoMergeLevel2
}

const authConfig = {
    ...commonConfig,
    key: 'auth',
    whitelist: ['isLoggedIn', 'typeLogin' , 'accesstoken' , 'userData']
}
const projectsConfig = {
    ...commonConfig, 
    key: 'projects', 
    whitelist: ['projects'], 
};

const projectsDetailConfig = {
    ...commonConfig, 
    key: 'projectDetail', 
    whitelist: ['projectDetail'],
};

const memberAllDetailConfig = {
    ...commonConfig, 
    key: 'allMember', 
    whitelist: ['memberData', 'loading', 'error'], 
};


const inviteMemberConfig = {
    ...commonConfig, 
    key: 'invite', 
    whitelist: ['success', 'loading', 'error'], 
};

const memberProjectConfig = {
    ...commonConfig, 
    key: 'memberProject', 
    whitelist: ['members', 'loading', 'error'], 
};

const taskConfig = {
    ...commonConfig,
    key: 'task',
    whitelist: ['task'],
};

const commentUserConfig = {
    ...commonConfig,
    key: 'commentUser',
    whitelist: ['commentUser'],
};

const commentConfig = {
    ...commonConfig,
    key: 'comment',
    whitelist: ['comment'],
};

const labelConfig = {
    ...commonConfig,
    key: 'label',
    whitelist: ['label'],
};


const fileConfig = {
    ...commonConfig,
    key: 'file',
    whitelist: ['files'],
};

const projectThunkSliceConfig = {
    ...commonConfig,
    key: 'projectThunk',
    whitelist: ['projectThunk'],
};  


const rootReducer = combineReducers({
    auth: persistReducer(authConfig, authReducer),
    projects: persistReducer(projectsConfig, projectsSlice),
    projectDetail: persistReducer(projectsDetailConfig, projectDetailSlice),
    allMember: persistReducer(memberAllDetailConfig, memberSlice),
    invite: persistReducer(inviteMemberConfig, inviteSlice),
    memberProject: persistReducer(memberProjectConfig, memberProjectSlice),
    ///
    task: persistReducer(taskConfig, taskSlice),
    commentUser: persistReducer(commentUserConfig, commentUserSlice),
    comment: persistReducer(commentConfig, commentSlice),
    label: persistReducer(labelConfig, labelSlice),

    uploadFile: persistReducer(fileConfig, fileSlice),
    projectThunk: persistReducer(projectThunkSliceConfig, projectThunkSlice),
})


export default rootReducer