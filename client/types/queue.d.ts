export interface Queue {
    id: number;
    name: string;
    state: 'waiting' | 'in_progress' | 'done';
    number: number;
}

export interface QueueState {
    queues: Queue[];
    active: Queue | null;
}

export interface QueueUpdateProps {
    action: 'call' | 'recall' | 'skip' | 'update' | 'markDone';
    queueId?: number;
    newNumber?: number;
}