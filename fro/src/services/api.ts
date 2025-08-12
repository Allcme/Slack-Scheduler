import axios from 'axios';
interface MessageData {
  channel: string;
  text: string;
  sendTime?: string;
}
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Add request interceptor for JWT
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const slackApi = {
    connectSlack: () => window.location.href = `${API_BASE_URL}/auth/slack`,
    getChannels: () => api.get('/api/channels'),
      
  sendMessage: (data: Omit<MessageData, 'sendTime'>) => api.post('/api/messages/send', data),
  
  scheduleMessage: (data: MessageData) => api.post('/api/messages/schedule', data),
  
    getScheduledMessages: () => api.get('/api/messages/scheduled'),
    cancelScheduledMessage: (id: string) => api.delete(`/api/messages/scheduled/${id}`)
};