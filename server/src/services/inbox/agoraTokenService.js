const { RtcTokenBuilder, RtcRole } = require('agora-access-token')
const dotenv = require('dotenv')
dotenv.config({ path: 'server/.env' })


const agoraTokenService = {
    generateToken: (channelName, uid, role = 1, expireTime = 3600) => {
        const currentTimestamp = Math.floor(Date.now() / 1000)
        const privilegeExpiredTs = currentTimestamp + expireTime

        // Use numeric uid for Agora token
        let numericUid
        if (typeof uid === 'string') {
            // Converting string user ID to a number (using a hash)
            numericUid = generateNumericUid(uid)
        } else {
            numericUid = uid
        }

        const roleConstant = role === 1 ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER

        const token = RtcTokenBuilder.buildTokenWithUid(
            process.env.AGORA_APP_ID,
            process.env.AGORA_APP_CERTIFICATE,
            channelName,
            numericUid,
            roleConstant,
            privilegeExpiredTs
        )
        return token
    }
}
const generateNumericUid = (userId) => {
    if (!userId) return Math.floor(Math.random() * 100000)
    return parseInt(userId.substring(0, 8), 16) % 100000000
}

module.exports = agoraTokenService
