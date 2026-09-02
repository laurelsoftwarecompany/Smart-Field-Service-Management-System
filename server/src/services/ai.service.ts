import axios from 'axios';

export const classifyServiceRequest = async (description: string) => {
    try {
        const response = await axios.post('http://127.0.0.1:8000/classify', {
            description
        });
        return response.data;
    } catch (error) {
        console.error('AI Service Connection Error:', error);
        throw new Error('Failed to communicate with AI classification service');
    }
};