const Subscription = require('~/models/SubscriptionSchema')

const subscriptionService = {
    createNew: async ({ userId, planId }) => {
        try {
            if (!userId) {
                throw new Error('User ID is required.')
            }
            if (!planId) {
                throw new Error('Plan ID is required.')
            }
            // Check if subscription already exists
            const existingSubscription = await Subscription.findOne({
                user_id: userId,
                plan_id: planId
            })
            if (existingSubscription) {
                return
            }
            const today = new Date()
            const endDate = new Date(today.setFullYear(today.getFullYear() + 1000))
            const newSubscription = new Subscription({
                user_id: userId,
                plan_id: planId,
                end_date: endDate
            })
            const savedSubscription = await newSubscription.save()
            return savedSubscription

        } catch (error) {
            throw new Error('Error creating subscription entry: ' + error.message)
        }
    },
    getAllByUser: async (userId) => {
        try {
            if (!userId) {
                throw new Error('User ID is required.')
            }
            const subscriptionItems = await Subscription.find({ user_id: userId })
                .populate('plan_id') // Chỉ lấy 3 field từ plan_id
                .lean()


            if (!subscriptionItems) {
                return []
            }
            return subscriptionItems
        } catch (error) {
            throw new Error('Error fetching subscription items: ' + error.message)
        }
    }
}

module.exports = subscriptionService