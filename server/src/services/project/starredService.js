const Starred = require('~/models/StarredSchema')

const starredService = {
    createNew: async ({ userId, projectId }) => {
        try {
            if (!userId || !projectId) {
                throw new Error('User ID and Project ID are required.')
            }
            const existingStarred = await Starred.findOne({ userId, projectId })
            if (existingStarred) {
                const updatedStarred = await Starred.findOneAndUpdate(
                    { userId, projectId },
                    { isStarred: true },
                    { new: true }// Trả về document sau khi update
                )
                return updatedStarred
            }
            // Nếu chưa tồn tại, tạo mới
            const newStarred = new Starred({
                userId,
                projectId
            })
            const savedStarred = await newStarred.save()
            return savedStarred

        } catch (error) {
            throw new Error('Error creating starred entry: ' + error.message)
        }
    },

    // Lấy tất cả các mục Starred của một người dùng
    getAllByUser: async (userId) => {
        try {
            if (!userId) {
                throw new Error('User ID is required.')
            }
            const starredItems = await Starred.find({ userId, isStarred: true })
                .populate('projectId')
                .lean()

            if (!starredItems) {
                return []
            }
            return starredItems
        } catch (error) {
            throw new Error('Error fetching starred items: ' + error.message)
        }
    },
    // Cập nhật trạng thái Starred
    updateStarred: async (userId, projectId, isStarred) => {
        try {
            if (!userId || !projectId) {
                throw new Error('userId and projectId are required.')
            }
            if (typeof isStarred !== 'boolean') {
                throw new Error('isStarred must be a boolean value.')
            }

            const starredProject = await Starred.findOne({ userId, projectId })

            if (!starredProject) {
                throw new Error('Starred project not found.')
            }

            starredProject.isStarred = isStarred
            const updatedStarred = await starredProject.save()

            return updatedStarred
        } catch (error) {
            throw new Error('Error updating starred status: ' + error.message)
        }
    }

}

module.exports = starredService