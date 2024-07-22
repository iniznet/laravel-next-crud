export interface Message {
    type: 'success' | 'error';
    content: string;
    fieldErrors?: {
        [key: string]: string;
    };
}