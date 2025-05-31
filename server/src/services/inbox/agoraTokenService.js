const { RtcTokenBuilder, RtcRole } = require('agora-access-token')
const dotenv = require('dotenv')
dotenv.config({ path: 'server/.env' })

const agoraTokenService = {
    generateToken: (channelName, uid, role = 1, expireTime = 3600) => {
        const currentTimestamp = Math.floor(Date.now() / 1000)
        const privilegeExpiredTs = currentTimestamp + expireTime

        // Use uid directly as numericUid
        const numericUid = uid

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

module.exports = agoraTokenService 