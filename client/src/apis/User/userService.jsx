import axios from 'axios'

export const apiChangePassword = (email, password) => new Promise(async (resolve, reject) => {
    try {
        let response = await axios({
            method: 'put',
            url: `${import.meta.env.VITE_URL_SERVER}/api/user/change-password`,
            data: { email, password },
            withCredentials: true  // Set withCredentials here
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});
export const apiChangePasswordProfile = (email, password, newPassword) => new Promise(async (resolve, reject) => {
    try {
        let response = await axios({
            method: 'put',
            url: `${import.meta.env.VITE_URL_SERVER}/api/user/change-password-profile`,
            data: { email, password, newPassword },
            withCredentials: true  // Set withCredentials here
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});
export const apiGetOne = (accesstoken) => new Promise(async (resolve, reject) => {
    try {
        let response = await axios({
            method: 'get',
            url: `${import.meta.env.VITE_URL_SERVER}/api/user/get-one`,
            headers: {
                authorization: `Bearer ${accesstoken}`
            },
            withCredentials: true  // Set withCredentials here
        })
        resolve(response)

    } catch (error) {
        reject(error)
    }
})
export const apiupdateUser= (accesstoken, data) => new Promise(async (resolve, reject) => {
    try {
        let response = await axios({
            method: 'put',
            url: `${import.meta.env.VITE_URL_SERVER}/api/user/update-user`,
            headers: {
                authorization: `Bearer ${accesstoken}`
            },
            data: data,
            withCredentials: true  // Set withCredentials here
        })
        resolve(response)

    } catch (error) {
        reject(error)
    }
})

export const getAllMembers = (accesstoken) => new Promise(async (resolve, reject) => {
    try {
        let response = await axios({
            method: 'get',
            url: `${import.meta.env.VITE_URL_SERVER}/api/user/all-member`,
            headers: {
                authorization: `Bearer ${accesstoken}`
            },
            withCredentials: true  // Set withCredentials here
        })
        resolve(response)

    } catch (error) {
        reject(error)
    }
})  


export const updateAll = (accesstoken, data) => new Promise(async (resolve, reject) => {
    try {
        let response = await axios({
            method: 'put',
            url: `${import.meta.env.VITE_URL_SERVER}/api/user/update-all`,
            headers: {
                authorization: `Bearer ${accesstoken}`
            },
            data: data,
            withCredentials: true  // Set withCredentials here
        })
        resolve(response)

    } catch (error) {
        reject(error)
    }
})
export const apiResetPasswordfromAdmin = (accesstoken, email , password) => new Promise(async (resolve, reject) => {
    try {
        let response = await axios({
            method: 'put',
            url: `${import.meta.env.VITE_URL_SERVER}/api/user/reset-password-admin`,
            headers: {
                authorization: `Bearer ${accesstoken}`
            },
            data: { email, password },
            withCredentials: true  // Set withCredentials here
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});

export const getMemberById = (accesstoken, id) => new Promise(async (resolve, reject) => {
    try {
        let response = await axios({
            method: 'get',
            url: `${import.meta.env.VITE_URL_SERVER}/api/user/member/${id}`,
            headers: {
                authorization: `Bearer ${accesstoken}`
            },
            withCredentials: true  // Set withCredentials here
        })
        resolve(response.data)

    } catch (error) {
        reject(error)
    }
})

