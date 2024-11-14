const MemberTask = require('~/models/MemberTaskSchema')
const Task = require('~/models/TaskSchema')

const updateMemberTask = async (memberId, reqBody) => {
    try {
        const existingMemberTask = await MemberTask.findById(memberId)
        if (!existingMemberTask) {
            throw new Error('Member not found')
        }
        await Task.findByIdAndUpdate(   
            existingMemberTask.task_id,
            {   
                $pull: { assigned_to_id: memberId }
            },  
            { new: true }
        )
        // Update fields
        Object.assign(existingMemberTask, reqBody)
        const updatedMemberTask = await existingMemberTask.save()
        return updatedMemberTask
    } catch (error) {
        throw new Error(`Failed to update member: ${error.message}`)
    }
}


module.exports = {updateMemberTask }