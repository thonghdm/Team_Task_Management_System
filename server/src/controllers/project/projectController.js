const projectService = require('~/services/project/projectServices')
const { StatusCodes } = require('http-status-codes')
const projectController = {
    createNew: async (req, res, next) => {
        try {
            const createProject = await projectService.createNew(req.body)
            // Combine project data with the message
            res.status(StatusCodes.CREATED).json({
                message: 'Project created successfully!',
                project: createProject // Include the created project data
            });
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error creating project' })
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
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    },
    getAllByOwnerId: async (req, res, next) => {
        try {
            const ownerId = req.query.ownerId // Get ownerId from query parameters
            const projects = await projectService.getAllByOwnerId(ownerId)
            res.status(StatusCodes.OK).json({
                projects: projects,
                message: 'GET all projects by ownerId'
            })
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }
}

module.exports = projectController