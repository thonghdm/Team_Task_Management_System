import authReducer from "./authReducer";
import { combineReducers } from 'redux'
import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist'
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";
import projectsSlice from '~/redux/project/project-slice';
import projectDetailSlice from '~/redux/project/projectDetail-slide';
import memberSlice from '~/redux/member/member-slice';
import inviteSlice from '~/redux/project/projectRole-slice/index';
import memberProjectSlice from '~/redux/project/projectRole-slice/memberProjectSlice'

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
    key: 'allMember', 
    whitelist: ['success', 'loading', 'error'], 
};

const memberProjectConfig = {
    ...commonConfig, 
    key: 'memberProject', 
    whitelist: ['members', 'loading', 'error'], 
};


const rootReducer = combineReducers({
    auth: persistReducer(authConfig, authReducer),
    projects: persistReducer(projectsConfig, projectsSlice),
    projectDetail: persistReducer(projectsDetailConfig, projectDetailSlice),
    allMember: persistReducer(memberAllDetailConfig, memberSlice),
    allMember: persistReducer(memberAllDetailConfig, memberSlice),
    invite: persistReducer(inviteMemberConfig, inviteSlice),
    memberProject: persistReducer(memberProjectConfig, memberProjectSlice),
})


export default rootReducer