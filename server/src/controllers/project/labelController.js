const labelService = require('~/services/project/labelService')
const { StatusCodes } = require('http-status-codes')
// const mongoose = require('mongoose')
const lableController = {
    createLabel: async (req, res, next) => {
        try {
            const createLabel = await labelService.createLabel(req.body)
            res.status(StatusCodes.CREATED).json({
                message: 'Label created successfully!',
                label: createLabel
            })
        } catch (error) {
            next(error)
        }
    }

}

module.exports = lableController