
import { SOCKET_URL,PREFIX } from '@/constants/config';
import {apiChat} from '@/services/apiChat';
const API_URL = `${SOCKET_URL}${PREFIX}`;
async function handleResponse(response: Response) {
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'API Error');
    }
    return response.json();
}

const chatApi = {
    conversations: {
        getAll: async (userId: string) => {
            const token = await getToken();
            const response = await fetch(`${API_URL}/v1/conversations/findAll/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            return handleResponse(response);
        },

        create: async (participants: string[], name?: string, isGroup: boolean = false) => {
            const token = await getToken();
            const response = await fetch(`${API_URL}/v1/conversations/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ participants, name, isGroup }),
            });
            return handleResponse(response);
        },

        search: async (query: string) => {
            const token = await getToken();
            const response = await fetch(`${API_URL}/v1/conversations/search?q=${encodeURIComponent(query)}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            return handleResponse(response);
        },

        addParticipant: async (conversationId: string, userId: string) => {
            const token = await getToken();
            const response = await fetch(`${API_URL}/v1/conversations/addParticipant`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ conversationId, userId }),
            });
            return handleResponse(response);
        },

        removeParticipant: async (conversationId: string, userId: string) => {
            const token = await getToken();
            const response = await fetch(`${API_URL}/v1/conversations/removeParticipant`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ conversationId, userId }),
            });
            return handleResponse(response);
        },
    },

    messages: {
        send: async (conversationId: string, text: string) => {
            const token = await getToken();
            const response = await fetch(`${API_URL}/v1/message/send-message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ conversationId, text }),
            });
            return handleResponse(response);
        },
    },
};

export default chatApi;