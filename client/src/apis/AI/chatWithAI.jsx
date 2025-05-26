import axios from 'axios';

export async function chatWithAI(prompt) {
    try {
        const response = await axios.post('http://localhost:5000/api/chat-ai/chat', 
            { prompt }, 
            { headers: { 'Content-Type': 'application/json' } }
        );

        return response.data.response;
    } catch (error) {
        console.error('Error fetching AI response:', error.response?.data?.error || error.message);
        return 'Error: Unable to process request';
    }
}

export async function AiAssignTasks(data) {
    try {
        const response = await axios.post('http://localhost:5000/api/chat-ai/assign-tasks', 
            data, 
            { headers: { 'Content-Type': 'application/json' } }
        );
        return response.data.response;
    } catch (error) {
        console.error('Error fetching AI response:', error.response?.data?.error || error.message);
        throw error; // Throw error to handle it in the component
    }
}
