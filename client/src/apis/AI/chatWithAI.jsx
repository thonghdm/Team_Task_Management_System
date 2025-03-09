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
