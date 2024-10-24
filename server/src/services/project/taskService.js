const List = require('~/models/ListSchema')
const Task = require('~/models/TaskSchema')
const createNew = async (reqBody) => {
    try {
        const newTaskData = {
            ...reqBody
        }
        const newTask = new Task(newTaskData)
        const createdTask = await newTask.save()

        const getNewTask = await Task.findById(createdTask._id)
        if (getNewTask) {
            await addTaskToList(getNewTask)
        }
        return getNewTask
    } catch (error) {
        throw new Error(error)
    }
}

const addTaskToList = async (task) => {
    try {
        const updatedDocument = await List.findOneAndUpdate(
            { _id: task.list_id },
            { $push: { task_id: task._id } },
            { returnDocument: 'after' }
        )
        return updatedDocument
    } catch (error) {
        throw new Error(`Error adding list to project: ${error.message}`)
    }
}


module.exports = { createNew }