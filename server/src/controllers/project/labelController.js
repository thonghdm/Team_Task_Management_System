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
    },
    updateLabel: async (req, res, next) => {
        const { _id } = req.body
        if (!_id) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: `Label ${ _id} is required` })
        }
        try {
            const updatedLabel = await labelService.updateLabel(_id, req.body)
            res.status(StatusCodes.OK).json({
                message: 'Label updated successfully!',
                label: updatedLabel
            })
        } catch (error) {
            next(error)
        }
    }

}

module.exports = lableController