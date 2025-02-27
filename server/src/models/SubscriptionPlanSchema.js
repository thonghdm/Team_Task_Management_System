const mongoose = require('mongoose');

const SubscriptionPlanSchema = new mongoose.Schema({
    subscription_type: {
        type: String,
        enum: ['Free', 'Plus', 'Pro'],
        required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    max_project: {
        type: Number,
        default: 10
    },
    max_list: {
        type: Number,
        default: 10
    },
    max_task: {
        type: Number,
        default: 100
    },
    max_member: {
        type: Number,
        default: 10
    }
}, {
    timestamps: true
})

const SubscriptionPlan = mongoose.model('SubscriptionPlan', SubscriptionPlanSchema)
module.exports = SubscriptionPlan
