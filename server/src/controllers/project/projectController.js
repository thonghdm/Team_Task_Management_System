const projectService = require('~/services/project/projectServices')
const { StatusCodes } = require('http-status-codes')
const mongoose = require('mongoose')
const projectController = {
    createNew: async (req, res, next) => {
        try {
            const createProject = await projectService.createNew(req.body)
            // Combine project data with the message
            res.status(StatusCodes.CREATED).json({
                message: 'Project created successfully!',
                project: createProject // Include the created project data
            })
        } catch (error) {
            next(error)
        }
    },
    getDetails: async (req, res, next) => {
        try {
            const projectDetails = await projectService.getDetails(req.params.id)
            res.status(StatusCodes.OK).json({
                project: projectDetails,
                message: 'GET controller: API Project'
            })
        } catch (error) {
            next(error)
        }
    },
    getAllByOwnerId: async (req, res, next) => {
        try {
            const ownerId = req.query.ownerId // Get ownerId from query parameters
            if (!ownerId) {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Owner ID is required' })
            }
            const projects = await projectService.getAllByOwnerId(ownerId)
            res.status(StatusCodes.OK).json({
                projects: projects,
                message: 'GET all projects by ownerId'
            })
        } catch (error) {
            next(error)
        }
    },
    getAllByMemberId: async (req, res, next) => {
        try {
            const { memberId } = req.query
            if (!memberId) {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Member ID is required' })
            }
            if (!mongoose.Types.ObjectId.isValid(memberId)) {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid Member ID format' })
            }
            const projects = await projectService.getAllByMemberId(memberId)
            res.status(StatusCodes.OK).json({
                projects: projects,
                message: 'GET all projects by memberId'
            })
        } catch (error) {
            next(error)
        }
    },
    updateProjectById: async (req, res, next) => {
        try {
            const updatedProject = await projectService.updateProjectById(req.params.id, req.body)
            res.status(StatusCodes.OK).json({
                message: 'Project updated successfully!',
                project: updatedProject
            })
        } catch (error) {
            next(error)
        }
    }

}

module.exports = projectController