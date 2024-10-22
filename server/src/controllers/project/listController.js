const listService = require('~/services/project/listService')
const { StatusCodes } = require('http-status-codes')
// const mongoose = require('mongoose')
const listController = {
    createNew: async (req, res, next) => {
        try {
            const createList = await listService.createNew(req.body)
            res.status(StatusCodes.CREATED).json({
                message: 'List created successfully!',
                list: createList
            })
        } catch (error) {
            next(error)
        }
    }

}

module.exports = listController