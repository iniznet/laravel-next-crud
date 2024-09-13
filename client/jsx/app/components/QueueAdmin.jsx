'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { QueueAPI } from '@/apis/QueueApi';
import { InputNumber } from 'primereact/inputnumber';
import echoClient from '@/lib/Echo';
const QueueAdmin = () => {
    const [queues, setQueues] = useState([]);
    const [active, setActive] = useState(null);
    const [loading, setLoading] = useState(true);
    const toast = useRef(null);
    const fetchQueueStatus = async () => {
        try {
            const response = await QueueAPI.status();
            setQueues(response.queues);
            setActive(response.active);
            setLoading(false);
        }
        catch (error) {
            console.error('Error fetching queue status:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch queue status' });
        }
    };
    const handleQueueUpdate = (event) => {
        console.log('Raw event data received:', event.data);
        const updatedQueues = event.data;
        setQueues(prevQueues => prevQueues.map(queue => updatedQueues.find((updatedQueue) => updatedQueue.id === queue.id) || queue));
    };
    const handleActiveUpdate = (event) => {
        console.log('Active queue update event received:', event.data);
        setActive(prevActive => ({ ...prevActive, ...event.data }));
    };
    useEffect(() => {
        fetchQueueStatus();
        echoClient.channel('queue')
            .listen('queueUpdate', handleQueueUpdate);
        echoClient.channel('queue')
            .listen('activeUpdate', handleActiveUpdate);
        return () => {
            console.log('Cleaning up WebSocket listeners');
            echoClient.leaveChannel('queue');
        };
    }, []);
    const callNext = async (queue) => {
        try {
            await QueueAPI.update({ action: 'call', queueId: queue.id });
        }
        catch (error) {
            console.error('Error calling next:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to call next number' });
        }
    };
    const recall = async (queue) => {
        try {
            await QueueAPI.update({ action: 'recall', queueId: queue.id });
        }
        catch (error) {
            console.error('Error recalling:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to recall number' });
        }
    };
    const finish = async (queue) => {
        try {
            await QueueAPI.update({ action: 'markDone', queueId: queue.id });
        }
        catch (error) {
            console.error('Error finishing:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to finish number' });
        }
    };
    const updateQueueNumber = async (queue, newNumber) => {
        try {
            await QueueAPI.update({ action: 'update', queueId: queue.id, newNumber });
        }
        catch (error) {
            console.error('Error updating queue number:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to update queue number' });
        }
    };
    if (loading) {
        return <div>Loading...</div>;
    }
    return (<div>
            <div className="grid mb-4">
                <Toast ref={toast}/>
                {queues
            .filter(queue => queue.state !== 'done')
            .map((queue) => (<div key={queue.id} className={`col-12 md:col-6 lg:col-3 ${active?.id === queue.id ? 'shadow-2' : ''}`}>
                            <div className="surface-card p-4 shadow-2 border-round">
                                <h2>{queue.name}</h2>
                                <InputNumber value={queue.number} onValueChange={(e) => updateQueueNumber(queue, e.value)} className="w-full mb-3" min={0}/>
                                <div className="grid gap-2">
                                    <Button label="Panggil" className="p-button-warning mr-2" onClick={() => callNext(queue)}/>
                                    <Button label="Panggil Ulang" className="p-button-secondary" onClick={() => recall(queue)}/>
                                    <Button label="Selesai" className="p-button-success" onClick={() => finish(queue)}/>
                                </div>
                            </div>
                        </div>))}
            </div>
            <div className="grid">
                <Toast ref={toast}/>
                {queues
            .filter(queue => queue.state === 'done')
            .map((queue) => (<div key={queue.id} className={`col-12 md:col-6 lg:col-3 ${active?.id === queue.id ? 'shadow-2' : ''}`}>
                            <div className="surface-card p-4 shadow-2 border-round">
                                <h2>{queue.name}</h2>
                                <InputNumber value={queue.number} onValueChange={(e) => updateQueueNumber(queue, e.value)} className="w-full mb-3" min={0}/>
                                <div className="grid gap-2">
                                    <Button label="Panggil" className="p-button-warning mr-2" onClick={() => callNext(queue)}/>
                                    <Button label="Panggil Ulang" className="p-button-secondary" onClick={() => recall(queue)}/>
                                    <Button label="Selesai" className="p-button-success" onClick={() => finish(queue)}/>
                                </div>
                            </div>
                        </div>))}
            </div>
        </div>);
};
export default QueueAdmin;
