const userService = require('~/services/user/userService')
const cloudinary = require('cloudinary').v2
const { StatusCodes } = require('http-status-codes')

const User = require('~/models/user')
const { uploadToCloudinary, deleteFromCloudinary } = require('~/utils/cloudinary')
const getOne = async (req, res) => {
    const { currentUser } = req
    try {
        if (!currentUser?._id) res.status(400).json({
            err: 1,
            msg: 'Missing inputs'
        })
        let response = await userService.getOneService(currentUser?._id)
        res.status(200).json(response)

    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at user controller ' + error
        })
    }
}
const updateUser = async (req, res) => {
    const { currentUser } = req
    const user = await User.findById(currentUser._id)
    try {
        if (!currentUser?._id) res.status(400).json({
            err: 1,
            msg: 'Missing inputs'
        })
        let imageUrl = user.image // Giữ nguyên ảnh cũ nếu không có upload mới
        if (req.file) {
            // Xóa ảnh cũ nếu có
            if (user.image) { await deleteFromCloudinary(user.image) }
            imageUrl = await uploadToCloudinary(req.file)
        }
        const updates = { ...req.body }
        updates.image = imageUrl.url
        let response = await userService.updateService(currentUser?._id, updates)
        res.status(200).json(response)

    } catch (error) {
        // Clean up newly uploaded file if update fails
        if (req.file) {
            const publicId = req.file.path
                .split('/')
                .slice(-2)
                .join('/')
                .split('.')[0]
            await cloudinary.uploader.destroy(publicId)
        }

        return res.status(500).json({
            err: -1,
            msg: 'Fail at user controller: ' + error.message
        })
    }
}
const changePassword = async (req, res) => {
    console.log('req.body', req.body)
    try {
        if (!req.body?.email) res.status(400).json({
            err: 1,
            msg: 'Missing inputs'
        })
        let response = await userService.changePasswordService(req.body?.email, req.body?.password)
        res.status(200).json(response)

    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at user controller ' + error
        })
    }
}
const changePasswordProfile = async (req, res) => {
    console.log('req.body', req.body)
    try {
        if (!req.body?.email) res.status(400).json({
            err: 1,
            msg: 'Missing inputs'
        })
        let response = await userService.changePasswordProfileService(req.body?.email, req.body?.password, req.body?.newPassword)
        res.status(200).json(response)

    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at user controller ' + error
        })
    }
}
const searchUsers = async (req, res, next) => {
    const { query } = req.query

    try {
        const users = await userService.searchUsers(query)
        res.status(StatusCodes.OK).json({
            users,
            message: 'GET controller: API search user'
        })
    } catch (error) {
        next(error)
    }
}

const getAllMembers = async (req, res, next) => {
    try {
        const users = await userService.getAllMembers()
        res.status(StatusCodes.OK).json({
            users,
            message: 'Successfully all members.'
        })
    } catch (error) {
        next(error)
    }
}

const updateAll = async (req, res, next) => {
    const { _id } = req.body
    if (!_id) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: `User ${_id} is required` })
    }
    try {
        const updateUser = await userService.updateUserByID(_id, req.body)
        res.status(StatusCodes.OK).json({
            message: 'Label updated successfully!',
            user: updateUser
        })
    } catch (error) {
        next(error)
    }
}


module.exports = {
    getOne,
    updateUser,
    searchUsers,
    getAllMembers,
    updateAll,
    changePassword,
    changePasswordProfile
}