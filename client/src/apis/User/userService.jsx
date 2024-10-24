import axios from 'axios'


export const apiGetOne = (accesstoken) => new Promise(async (resolve, reject) => {
    try {
        let response = await axios({
            method: 'get',
            url: 'http://localhost:5000/api/user/get-one',
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
            url: 'http://localhost:5000/api/user/update-user',
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

