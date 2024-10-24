/* eslint-disable no-unused-vars */

import { StatusCodes } from 'http-status-codes'
// import { env } from '~/config/environment'

// Middleware xử lý lỗi tập trung
export const errorHandling= (err, req, res, next) => {
    if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR
    const responseError = {
        statusCode: err.statusCode,
        message: err.message || StatusCodes[err.statusCode], // Nếu lỗi mà không có message thì lấy ReasonPhrases chuẩn theo mã Status Code
        stack: err.stack
    }
    res.status(responseError.statusCode).json(responseError)
}