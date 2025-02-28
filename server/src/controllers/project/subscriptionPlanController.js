const { StatusCodes } = require('http-status-codes')
const subscriptionPlanService = require('~/services/project/subscriptionPlanService')
const subscriptionPlanController = {
    getAllPlans: async (req, res, next) => {
        try {
            const plans = await subscriptionPlanService.getAllPlans()
            res.status(StatusCodes.OK).json({
                plans: plans,
                message: 'GET all subscription plans'
            })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = subscriptionPlanController