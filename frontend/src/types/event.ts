export interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
}

export interface EventResponse {
    success: boolean;
    data: {
        events: Event[]; 
        pagination: any;
    };
}