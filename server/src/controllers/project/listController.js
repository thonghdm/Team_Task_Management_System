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
    },
    updateListById: async (req, res, next) => {
        const { listId } = req.params
        try {
            const list = await listService.updateListById(listId, req.body)
            if (!list) {
                return res.status(StatusCodes.NOT_FOUND).json({ message: 'List not found' })
            }
            res.status(StatusCodes.OK).json({
                message: 'List updated successfully!',
                list: list
            })
        } catch (error) {
            next(error)
        }
    }

}

module.exports = listController