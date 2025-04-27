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
    },

    getUserBills: async (req, res, next) => {
        try {
            const { userId } = req.params
            const bills = await subscriptionService.getUserBills(userId)
            res.status(StatusCodes.OK).json({
                message: 'User bills retrieved successfully!',
                data: bills
            })
        } catch (error) {
            next(error)
        }
    },
    getAllBills: async (req, res, next) => {
        try {
            const bills = await subscriptionService.getAllBills()
            res.status(StatusCodes.OK).json({
                message: 'All bills retrieved successfully!',
                data: bills
            })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = subscriptionController