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

const getMemberTasksByMemberId = async (memberId) => {
    try {
        const memberTasks = await MemberTask.find({
            memberId: memberId,
            is_active: true
        })
            .populate({
                path: 'task_id',
                match: { is_active: true },
                // select: 'task_name description status priority due_date start_date end_date project_id is_active', // Select relevant task fields
                // select: 'task_name', // Select relevant task fields
                populate: [
                    {
                        path: 'assigned_to_id',
                        select: 'memberId',
                        populate: {
                            path: 'memberId',
                            select: 'email _id image displayName'
                        }
                    },
                    {
                        path: 'project_id',
                        select: 'projectName isActive'
                    }
                ]

            })
        // .populate({
        //     path: 'memberId',
        //     select: 'email _id image displayName is_active'
        // });

        return memberTasks
    } catch (error) {
        throw new Error(`Error fetching member tasks: ${error.message}`)
    }
}


module.exports = { updateMemberTask, getMemberTasksByMemberId }