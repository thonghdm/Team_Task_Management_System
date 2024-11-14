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

const updateLabel = async (labelId, updateData) => {
    try {
        const existingLabel = await Label.findById(labelId)
        if (!existingLabel) {
            throw new Error('Label not found')
        }
        await Task.findByIdAndUpdate(   
            existingLabel.task_id,
            {   
                $pull: { label_id: labelId }
            },
            { new: true }
        )
        // Update fields
        Object.assign(existingLabel, updateData)
        const updatedLabel = await existingLabel.save()
        return updatedLabel
    } catch (error) {
        throw new Error(`Failed to update label: ${error.message}`)
    }
}

module.exports = { createLabel,updateLabel }
