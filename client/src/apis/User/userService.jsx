import aixos from 'axios'


export const apiGetOne = (token) => new Promise(async (resolve, reject) => {
    try {
        let response = await aixos({
            method: 'get',
            url: 'http://localhost:5000/api/user/get-one',
            headers: {
                authentication: token
            },
            withCredentials: true  // Set withCredentials here
        })
        resolve(response)

    } catch (error) {
        reject(error)
    }
})

