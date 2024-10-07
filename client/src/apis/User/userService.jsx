import aixos from 'axios'


export const apiGetOne = (accesstoken) => new Promise(async (resolve, reject) => {
    try {
        let response = await aixos({
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

