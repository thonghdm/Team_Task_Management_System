import nodemailer from 'nodemailer'

const MAX_RETRIES = 3;
const RETRY_DELAY = 10000;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const sendEmail = async (options, retryCount = 0) => {
    // Validate required fields
    if (!options) {
        throw new Error('Email options are required')
    }
    if (!options.email) {
        throw new Error('Recipient email address is required')
    }
    if (!options.subject) {
        throw new Error('Email subject is required')
    }
    if (!options.message) {
        throw new Error('Email message is required')
    }

    // console.log(`Attempt ${retryCount + 1}/${MAX_RETRIES} - Sending email to:`, options.email, 'Subject:', options.subject)

    const transporter = nodemailer.createTransport({
        host: process.env.GMAIL_HOST,
        port: process.env.GMAIL_PORT,
        secure: true, // Use TLS
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        },
        pool: true, // Use pooled connections
        maxConnections: 1, // Limit to one connection at a time
        maxMessages: 3, // Limit messages per connection
        rateDelta: 1000, // How many messages to send per second
        rateLimit: 3 // Max number of messages per rateDelta
    })

    const mailOptions = {
        from: { name: 'DTPROJECT', address: process.env.GMAIL_USER },
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    try {
        await transporter.sendMail(mailOptions)
    } catch (error) {
        console.error(`Attempt ${retryCount + 1} failed:`, error.message)

        // Check if this is a temporary error that we should retry
        const isTemporaryError = 
            error.code === 'EENVELOPE' && 
            error.responseCode === 421 || // Temporary system problem
            error.code === 'ETIMEDOUT' || // Connection timeout
            error.code === 'ECONNRESET' || // Connection reset
            error.code === 'ESOCKET' || // Socket error
            error.message.includes('Temporary System Problem') ||
            error.message.includes('Try again later');

        if (isTemporaryError && retryCount < MAX_RETRIES - 1) {
            console.log(`Retrying in ${RETRY_DELAY/1000} seconds...`)
            await sleep(RETRY_DELAY)
            return sendEmail(options, retryCount + 1)
        }

        throw new Error(`Failed to send email after ${retryCount + 1} attempts: ${error.message}`)
    } finally {
        // Close the transporter
        transporter.close()
    }
}

export default sendEmail