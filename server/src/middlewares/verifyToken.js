const jwt = require('jsonwebtoken')
require('dotenv').config()

const verifyToken = (req, res, next) => {
    let token = req?.headers?.authorization?.split(' ')[1]
    if (!token) {
        return res.status(500).json({
            err: 1,
            msg: 'Chưa đăng nhập'
        })
    }
    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decode) => {
        if (err) {
            return res.status(401).json({
                err: 2,
                msg: 'Token không hợp lệ'
            })
        }
        req.currentUser = decode
        next()
    })
}
//dsdsd
module.exports = verifyToken