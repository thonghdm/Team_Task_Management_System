const List = require('~/models/ListSchema')
const Project = require('~/models/ProjectSchema')
const createNew = async (reqBody) => {
    try {
        const newListData = {
            ...reqBody
        }
        const newList = new List(newListData)
        const createdList = await newList.save()

        const getNewList = await List.findById(createdList._id)
        if (getNewList) {
            getNewList.tasks = []
            await addListToProject(getNewList)
        }

        return getNewList
    } catch (error) {
        throw new Error(error)
    }
}

const addListToProject = async (list) => {
    try {
        const updatedDocument = await Project.findOneAndUpdate(
            { _id: list.project_id },
            { $push: { listId: list._id } },
            { returnDocument: 'after' }
        )
        return updatedDocument
    } catch (error) {
        throw new Error(`Error adding list to project: ${error.message}`)
    }
}

const updateListById = async (listId, reqBody) => {
    try {
        const list = await List.findById(listId)
        if (!list) {
            throw new Error('List not found')
        }

        if (reqBody.is_active === false) {
            await Project.findByIdAndUpdate(
                { _id: list.project_id },
                { $pull: { listId: list._id } },
                { returnDocument: 'after' }
            )
        }

        Object.assign(list, reqBody)
        const updatedTask = await list.save()
        return updatedTask
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = { createNew, updateListById }