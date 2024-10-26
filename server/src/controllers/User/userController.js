const userService = require('~/services/user/userService')
const cloudinary = require('cloudinary').v2
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
    try {
        if (!currentUser?._id) res.status(400).json({
            err: 1,
            msg: 'Missing inputs'
        })
        const updates = { ...req.body }
        if (req.file) {
            if (currentUser.image) {
                try {
                    const publicId = currentUser.image
                        .split('/')
                        .slice(-2) // Get last 2 segments
                        .join('/') // Join them back
                        .split('.')[0] // Remove file extension

                    await cloudinary.uploader.destroy(publicId)
                    console.log('Old image deleted successfully')
                } catch (deleteError) {
                    console.error('Error deleting old image:', deleteError)
                    // Continue with update even if delete fails
                }
            }
            updates.image = req.file.path
        }
        delete updates.password
        delete updates.email
        delete updates._id
        let response = await userService.updateService(currentUser?._id, updates)
        res.status(200).json(response)

    } catch (error) {
        // Clean up newly uploaded file if update fails
        if (req.file) {
            try {
                const publicId = req.file.path
                    .split('/')
                    .slice(-2)
                    .join('/')
                    .split('.')[0];

                await cloudinary.uploader.destroy(publicId);
                console.log('New image cleaned up after failed update');
            } catch (cleanupError) {
                console.error('Error cleaning up uploaded file:', cleanupError);
            }
        }

        console.error('Update user error:', error);
        return res.status(500).json({
            err: -1,
            msg: 'Fail at user controller: ' + error.message
        });
    }
}
module.exports = {
    getOne,
    updateUser
}