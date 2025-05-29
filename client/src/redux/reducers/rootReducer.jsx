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
import starredSlice from '~/redux/project/starred-slice/index';

import auditLogSlice from '~/redux/project/auditLog-slice/index';
import taskInviteUserSlice from '~/redux/project/task-slice/task-inviteUser-slice/index';

import subscriptionSlice from '~/redux/project/subscription-slice/index';

import notificationSlice from '~/redux/project/notifications-slice/index';
import conversationSlice from '~/redux/chat/conversation-slice';
import chatFileSlice from '~/redux/chat/chatFile-slice';

// Cấu hình cho persist
const commonConfig = {
    storage,
    stateReconciler: autoMergeLevel2
}

const authConfig = {
    ...commonConfig,
    key: 'auth',
    whitelist: ['isLoggedIn', 'typeLogin', 'accesstoken', 'userData']
}
const projectsConfig = {
    ...commonConfig,
    key: 'projects',
    whitelist: ['projects', 'loading', 'error'],
};

const projectsDetailConfig = {
    ...commonConfig,
    key: 'projectDetail',
    whitelist: ['projectDetail', 'loading', 'error'],
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
    whitelist: ['task', 'loading', 'error'],
};

const commentUserConfig = {
    ...commonConfig,
    key: 'commentUser',
    whitelist: ['commentUser', 'loading', 'error'],
};

const commentConfig = {
    ...commonConfig,
    key: 'comment',
    whitelist: ['comment', 'loading', 'error'],
};

const labelConfig = {
    ...commonConfig,
    key: 'label',
    whitelist: ['label','loading', 'error'],
};


const fileConfig = {
    ...commonConfig,
    key: 'file',
    whitelist: ['files', 'loading', 'error'],
};

const projectThunkSliceConfig = {
    ...commonConfig,
    key: 'projectThunk',
    whitelist: ['project', 'loading', 'error'],
};

const starredSliceConfig = {
    ...commonConfig,
    key: 'starred',
    whitelist: ['starred', 'loading', 'error'],
};
const auditLogSliceConfig = {
    ...commonConfig,
    key: 'auditLog',
    whitelist: ['auditLog', 'loading', 'error'],
};

const taskInviteUserSliceConfig = {
    ...commonConfig,
    key: 'taskInviteUser',
    whitelist: ['success', 'loading', 'error'],
};

// Cấu hình cho persist
const subscriptionConfig = {
    ...commonConfig,
    key: 'subscription',
    whitelist: ['subscription', 'loading', 'error'],
};

// Cấu hình cho persist
const notificationConfig = {
    ...commonConfig,
    key: 'notification',
    whitelist: ['notifications', 'loading', 'error'],
};

// Cấu hình cho persist conversation
const conversationConfig = {
    ...commonConfig,
    key: 'conversation',
    whitelist: ['conversations', 'currentConversation', 'messages', 'loading', 'error'],
};

// Cấu hình cho persist chat files
const chatFileConfig = {
    ...commonConfig,
    key: 'chatFile',
    whitelist: ['files', 'loading', 'error'],
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
    starred: persistReducer(starredSliceConfig, starredSlice),
    auditLog: persistReducer(auditLogSliceConfig, auditLogSlice),
    taskInviteUser: persistReducer(taskInviteUserSliceConfig, taskInviteUserSlice),
    subscription: persistReducer(subscriptionConfig, subscriptionSlice),
    notification: persistReducer(notificationConfig, notificationSlice),
    conversation: persistReducer(conversationConfig, conversationSlice),
    chatFile: persistReducer(chatFileConfig, chatFileSlice),
})


export default rootReducer