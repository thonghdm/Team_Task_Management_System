const SubscriptionPlan = require('~/models/SubscriptionPlanSchema')

const subscriptionPlanService = {
    getAllPlans: async () => {
        return SubscriptionPlan.find()
    }
}

module.exports = subscriptionPlanService