const User = require('~/models/user') // Import the Mongoose user model

const getOneService = (id) => new Promise((resolve, reject) => {
    (async () => {
        try {
            const response = await User.findOne({ _id: id })
                .select('_id email displayName image isAdmin is_active createdAt phoneNumber company location jobTitle department')
                .lean()
            resolve({
                err: response ? 0 : 4,
                msg: response ? 'OK' : 'User not found!',
                response
            })
        } catch (error) {
            reject({
                err: 2,
                msg: 'Fail at user server: ' + error.message
            })
        }
    })()
})
const updateService = (id, data) => new Promise((resolve, reject) => {
    (async () => {
        try {
            const response = await User.findOneAndUpdate({ _id: id }, data, { new: true }).lean()
            resolve({
                err: response ? 0 : 4,
                msg: response ? 'OK' : 'User not found!',
                response
            })
        } catch (error) {
            reject({
                err: 2,
                msg: 'Fail at user server: ' + error.message
            })
        }
    })()
})

const searchUsers = async (query) => {
    if (!query) {
        throw new Error('Query parameter is required.')
    }

    return await User.find({
        $or: [
            { displayName: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } },
            { username: { $regex: query, $options: 'i' } } // Ensure this field exists in your schema
        ]
    })
}

const getAllMembers = async () => {
    try {
        const user = await User.find()
            .select('_id email username displayName image isAdmin is_active')
        return user
    } catch (error) {
        throw new Error(`Error fetching user: ${error.message}`)
    }
}

module.exports = {
    updateService,
    getOneService,
    searchUsers,
    getAllMembers
}
