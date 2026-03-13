import api from '../api/axiosConfig';
import type { EventResponse } from '../types/event';

export const eventService = {
  getEvents: async (skip: number, take: number): Promise<EventResponse> => {
    const response = await api.get<EventResponse>(`/events?skip=${skip}&take=${take}`);
    return response.data; 
  }
};