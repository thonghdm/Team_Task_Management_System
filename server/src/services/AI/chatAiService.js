const { GoogleGenerativeAI } = require('@google/generative-ai')
require('dotenv').config()

// Initialize Gemini API client
const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY)

// const client = new OpenAI({
//     baseURL: 'https://openrouter.ai/api/v1',
//     // apiKey: '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',
//     apiKey: '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',
//     defaultHeaders: {
//         'HTTP-Referer': 'http://localhost:3000',
//         'X-Title': 'Local Development'
//     }
// })


// const client = new OpenAI({
//     baseURL: 'https://api.x.ai/v1',
//     // apiKey: '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',
//     apiKey: process.env.AI_API_KEY,
//     defaultHeaders: {
//         'HTTP-Referer': 'http://localhost:3000',
//         'X-Title': 'Local Development'
//     }
// })


async function chatAiService(prompt) {
    try {
        if (!prompt) throw new Error('Prompt is required')

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

        // Generate content
        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()

        if (!text) {
            throw new Error('Unexpected API response structure')
        }

        return text
    } catch (error) {
        throw new Error(error.message)
    }
}

// AI-supported Task Assignment Service with combined prompts
async function aiTaskAssignment(userPrompt, tasks, members) {
    try {
        if (!Array.isArray(tasks) || !Array.isArray(members)) {
            throw new Error('Invalid input: tasks and members must be arrays')
        }

        // Prepare sample data for the AI prompt
        const taskData = JSON.stringify(tasks.slice(0, 50))
        const memberData = JSON.stringify(members.slice(0, 50)) // Limiting to first 3 members for brevity

        // Combine user prompt with system prompt
        // ... existing code ...
        const systemPrompt = `
       You are an AI task assignment assistant. Your role is to analyze tasks and team members to create optimal work assignments.

       Given the following data:
       Tasks: ${taskData}
       Team Members: ${memberData}

       Please analyze and create task assignments following these universal principles:

       1. Skill Matching
          - Match tasks to members based on their skills and expertise
          - Consider each member's primary role and capabilities
          - Ensure tasks align with member's experience level

       2. Workload Distribution
          - Distribute tasks evenly across team members
          - Consider current workload and availability
          - Avoid overloading any single team member

       3. Task Priority and Timeline
          - Consider task deadlines and priorities
          - Ensure high-priority tasks are assigned to available members
          - Check for scheduling conflicts in task timelines
          - Use the task's start_date and end_date for timeline planning

       4. Team Collaboration
          - Consider team dynamics and collaboration needs
          - Balance individual and group work
          - Account for dependencies between tasks

       Return a JSON array of task assignments in this exact format:
       [
           {
               "task_id": "string",
               "task_name": "string",
               "priority": "string", // Can be "High", "Medium", or "Low"
               "start_date": "YYYY-MM-DDTHH:mm:ss.sssZ",
               "end_date": "YYYY-MM-DDTHH:mm:ss.sssZ",
               "assigned_to": [
                   {
                       "memberId": "string",
                       "displayName": "string",
                       "username": "string",
                       "image": "string",
                       "email": "string"
                   }
               ]
           }
       ]

       Rules for the response:
       1. Return only valid JSON
       2. Include all required fields including start_date, end_date, and priority
       3. Priority must be one of: "High", "Medium", or "Low"
       4. No additional text or formatting
       5. Each task must have at least one assigned member
       6. Member IDs must match the provided data
       7. Dates must be in ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)
       8. Use the original task's start_date and end_date if available
       9. If dates are not available, use reasonable dates based on task priority and dependencies
       10. If priority is not specified, default to "Medium"
        `
        // ... existing code ...

        // Combine prompts intelligently
        const combinedPrompt = userPrompt ? `${systemPrompt}\n\nAdditional context and requirements:${userPrompt}` : systemPrompt

        // Get the AI's task assignments
        const assignments = await chatAiService(combinedPrompt)
        // Sanitize the AI response: remove unwanted characters like markdown code blocks
        const sanitizedResponse = assignments.replace(/```json/g, '').replace(/```/g, '').trim()
        // Try to parse the cleaned response
        let parsedAssignments
        try {
            parsedAssignments = JSON.parse(sanitizedResponse)
        } catch (error) {
            throw new Error('Error parsing AI response into JSON')
        }

        // Format the assignments into the desired structure
        const formattedAssignments = parsedAssignments.map(assignment => {
            return {
                task_id: assignment.task_id,
                task_name: assignment.task_name,
                list_name: assignment.list_name,
                priority: assignment.priority,
                start_date: assignment.start_date,
                end_date: assignment.end_date,
                assigned_to: assignment.assigned_to.map(member => ({
                    memberId: member.memberId,
                    displayName: member.displayName,
                    username: member.username,
                    email: member.email,
                    image: member.image
                }))
            }
        })

        return { assignments: formattedAssignments }
    } catch (error) {
        throw new Error(`Task assignment error: ${error.message}`)
    }
}


module.exports = {
    chatAiService,
    aiTaskAssignment
}
