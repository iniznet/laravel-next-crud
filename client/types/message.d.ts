export interface Message {
    type: 'success' | 'error';
    content: string;
    fieldErrors?: {
        [key: string]: string;
    };
}

export interface FieldErrors {
    [key: string]: string[];
}