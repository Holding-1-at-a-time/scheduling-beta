import axios from 'axios';

const api = axios.create({
    baseURL: 'https://your-api-url.com', // replace with your API URL
});

export const getQuote = async (vehicleDetails: any, selectedServices: any[]) => {
    try {
        const response = await api.post('/quote', {
            vehicleDetails,
            selectedServices,
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};