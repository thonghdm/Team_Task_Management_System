const Label = require('~/models/LabelSchema')
const Task = require('~/models/TaskSchema')

const createLabel = async (reqBody) => {
    try {
        const newLabelData = {
            ...reqBody
        }
        const newLabel = new Label(newLabelData)
        const createdLabel = await newLabel.save()

        const getNewLabel = await Label.findById(createdLabel._id)
        if (getNewLabel) {
            await addLabelToTask(getNewLabel)
        }
        return getNewLabel
    } catch (error) {
        throw new Error(error)
    }
}

const addLabelToTask = async (label) => {
    try {
        const updatedDocument = await Task.findOneAndUpdate(
            { _id: label.task_id },
            { $push: { label_id: label._id } },
            { returnDocument: 'after' }
        )
        return updatedDocument
    } catch (error) {
        throw new Error(`Error adding label to task: ${error.message}`)
    }
}

module.exports = { createLabel }
