const User = require('~/models/user') // Import the Mongoose user model
const bcrypt = require('bcrypt')
const changePasswordService = (email, password) => new Promise((resolve, reject) => {
    (async () => {
        try {
            const salt = await bcrypt.genSalt(10)
            const hashed = await bcrypt.hash(password, salt)
            const user = await User.findOne({ email })
            if (!user) {
                return resolve({
                    err: 4,
                    msg: 'User not found!'
                })
            }
            user.password = hashed
            const response = await user.save()
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
    }
    )()
})
const changePasswordProfileService = (email, password, newPassword) => new Promise((resolve, reject) => {
    (async () => {
        try {
            const user = await User.findOne({ email})
            if (!user) {
                return resolve({
                    err: 4,
                    msg: 'User not found!'
                })
            }
            const validPassword = await bcrypt.compare(password, user.password)
            if (!validPassword) {
                return resolve({
                    err: 5,
                    msg: 'Incorrect password!'
                })
            }
            const salt = await bcrypt.genSalt(10)
            const hashed = await bcrypt.hash(newPassword, salt)
            user.password = hashed
            const response = await user.save()
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
    }
    )()
})
const getOneService = (id) => new Promise((resolve, reject) => {
    (async () => {
        try {
            const response = await User.findOne({ _id: id })
                .select('_id email displayName image isAdmin is_active createdAt phoneNumber company location jobTitle department note password')
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

const updateUserByID = async (userId, updateData) => {
    try {
        const existingUser = await User.findById(userId)
        if (!existingUser) {
            throw new Error('User not found')
        }
        // Update fields
        Object.assign(existingUser, updateData)
        const updatedUser = await existingUser.save()
        return updatedUser
    } catch (error) {
        throw new Error(`Failed to update user: ${error.message}`)
    }
}

module.exports = {
    updateService,
    getOneService,
    searchUsers,
    getAllMembers,
    updateUserByID,
    changePasswordService,
    changePasswordProfileService
}
