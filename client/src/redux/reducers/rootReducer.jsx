import authReducer from "./authReducer";
import { combineReducers } from 'redux'
import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist'
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";
import projectsSlice from '~/redux/project/project-slice';
import projectDetailSlice from '~/redux/project/projectDetail-slide';

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
    ...commonConfig, // Sử dụng lại commonConfig đã có
    key: 'projects', // Đặt key cho projects
    whitelist: ['projects'], // Added projectDetail to whitelist
};

const projectsDetailConfig = {
    ...commonConfig, // Sử dụng lại commonConfig đã có
    key: 'projectDetail', // Đặt key cho projects
    whitelist: ['projectDetail'], // Added projectDetail to whitelist
};


const rootReducer = combineReducers({
    auth: persistReducer(authConfig, authReducer),
    projects: persistReducer(projectsConfig, projectsSlice), // Sử dụng cấu hình cho projects
    projectDetail: persistReducer(projectsDetailConfig, projectDetailSlice)
})


export default rootReducer