const Stripe = require('stripe')
import SubscriptionPlan from '~/models/SubscriptionPlanSchema.js'
import Subscription from '~/models/SubscriptionSchema.js'
// import User from '~/models/UserSchema.js'
import mongoose from 'mongoose'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000'


export const createCheckoutSession = async (req, res, next) => {
    try {
        const { userId, planId } = req.body
        const plan = await SubscriptionPlan.findById(planId)
        if (!plan) {
            return res.status(404).json({ success: false, message: 'Gói đăng ký không tồn tại!' })
        }
        // 2. Kiểm tra xem user có Subscription chưa
        const existingSubscription = await Subscription.findOne({ user_id: userId, is_active: true })

        if (existingSubscription?.plan_id.toString() === planId && existingSubscription?.user_id.toString() === userId) {
            return res.status(400).json({
                success: false,
                message: 'Bạn đã có một gói đăng ký đang hoạt động!'
            })
        }

        // 3. Tạo phiên thanh toán trên Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: `${clientUrl}/board/payment/success/`,
            cancel_url: `${clientUrl}/board/payment/error`,
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        unit_amount: plan?.price * 100, // Chuyển đổi sang cents
                        product_data: {
                            name: `Subscription Plan - ${plan?.subscription_type}`,
                            description: plan?.description
                        }
                    },
                    quantity: 1
                }
            ],
            metadata: {
                userId: userId,
                planId: planId
            }
        })
        // 4. Trả về URL Stripe để người dùng thanh toán
        return res.status(200).json({
            success: true,
            url: session.url
        })
    } catch (error) {
        next(error) // Xử lý lỗi
    }
}

export const stripeWebhook = async (req, res) => {
    try {
        const sig = req.headers['stripe-signature']
        const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object

            if (!session.metadata?.userId || !session.metadata?.planId) {
                return res.status(400).json({ success: false, message: 'Missing metadata!' })
            }

            const userId = session.metadata.userId
            const planId = session.metadata.planId

            const plan = await SubscriptionPlan.findById(planId)
            if (!plan) return res.status(404).json({ success: false, message: 'Gói đăng ký không hợp lệ!' })

            let endDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1))
            if (plan.subscription_type === 'Free') {
                endDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1000))
            }

            const subscription = await Subscription.findOneAndUpdate(
                { user_id: userId },
                {
                    plan_id: planId,
                    end_date: endDate,
                    is_active: true
                },
                { new: true, upsert: true }
            )

            if (!subscription) {
                return res.status(500).json({ success: false, message: 'Subscription update failed!' })
            }
            return res.status(200).json({ success: true, message: 'Subscription activated!' })
        }

        res.status(200).json({ success: true })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Webhook processing error', error: error.message })
    }
}



