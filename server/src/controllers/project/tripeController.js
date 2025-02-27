const Stripe = require('stripe')
import SubscriptionPlan from '~/models/SubscriptionPlanSchema.js'
import Subscription from '~/models/SubscriptionSchema.js'
// import User from '~/models/UserSchema.js'

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

        if (existingSubscription) {
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
        const event = stripe.webhooks.constructEvent(
            req.body,
            req.headers['stripe-signature'],
            process.env.STRIPE_WEBHOOK_SECRET
        )

        // Xử lý sự kiện thanh toán thành công
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object

            const userId = session.metadata.userId
            const planId = session.metadata.planId

            // Lấy thông tin gói đăng ký
            const plan = await SubscriptionPlan.findById(planId)
            if (!plan) return res.status(404).json({ success: false, message: 'Gói đăng ký không hợp lệ!' })

            // Tạo Subscription cho user
            const newSubscription = new Subscription({
                user_id: userId,
                plan_id: planId,
                start_date: new Date(),
                end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // 1 năm
                is_active: true
            })

            await newSubscription.save()

            return res.status(200).json({ success: true, message: 'Subscription activated!' })
        }

        res.status(200).json({ success: true })
    } catch (error) {
        res.status(500).send('Webhook processing error')
    }
}

