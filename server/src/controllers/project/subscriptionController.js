const subscriptionService = require('~/services/project/subscriptionService')
const { StatusCodes } = require('http-status-codes')

const subscriptionController = {
    createNew: async (req, res, next) => {
        try {
            const { userId, planId } = req.body
            const createdSubscription = await subscriptionService.createNew({ userId, planId })
            res.status(StatusCodes.CREATED).json({
                message: 'Project subscribed successfully!',
                data: createdSubscription
            })
        } catch (error) {
            next(error)
        }
    },
    getAllByUser: async (req, res, next) => {
        try {
            const { userId } = req.params
            const subscriptionList = await subscriptionService.getAllByUser(userId)
            res.status(StatusCodes.OK).json({
                message: 'Subscribed plan retrieved successfully!',
                data: subscriptionList
            })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = subscriptionController