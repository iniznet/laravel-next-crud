<?php

namespace App\Http\Controllers;

use App\Enums\QueueState;
use App\Events\Queue\ActiveQueueUpdate;
use App\Events\Queue\QueueUpdate;
use App\Models\Invoice;
use App\Models\NotaService;
use App\Models\Queue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class QueueController extends Controller
{
    public function index()
    {
        $queues = Queue::all();
        $queues = $queues->map(function ($queue) {
            $queue->name = $queue->getName();
            return $queue;
        });

        $activeQueue = $queues->firstWhere('state', QueueState::IN_PROGRESS);

        return response()->json([
            'queues' => $queues,
            'activeQueue' => $activeQueue,
        ]);
    }

    public function update(Request $request)
    {
        $action = $request->input('action');
        $queueId = $request->input('queueId');

        DB::beginTransaction();

        try {
            $queues = Queue::all();
            $queue = Queue::findOrFail($queueId);

            match ($action) {
                'call', 'recall' => $this->setQueueActive($queue),
                'markDone' => $this->markQueueDone($queue),
                'update' => $this->updateQueue($queue, $request),
            };

            DB::commit();

            $queues = Queue::all();
            $queues = $queues->map(function ($queue) {
                $queue->name = $queue->getName();
                return $queue;
            });

            broadcast(new QueueUpdate($queues));

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    private function setQueueActive(Queue $queue)
    {
        $queue->state = QueueState::IN_PROGRESS;
        $queue->save();

        $activeQueue = Cache::get('activeQueue', Queue::where('state', QueueState::IN_PROGRESS)->first());

        if ($activeQueue->id !== $queue->id) {
            $activeQueue->state = QueueState::WAITING;
            $activeQueue->save();
        }

        broadcast(new ActiveQueueUpdate([
            'id' => $queue->id,
            'name' => $queue->getName(),
            'number' => $queue->number,
            'state' => $queue->state,
        ]));
        Cache::put('activeQueue', $queue);
    }

    private function markQueueDone(Queue $queue)
    {
        $queue->state = QueueState::DONE;
        $queue->save();

        $nextQueue = Queue::where('state', QueueState::WAITING)->orderBy('number')->first();
        if ($nextQueue) {
            $nextQueue->state = QueueState::IN_PROGRESS;
            $nextQueue->save();

            broadcast(new ActiveQueueUpdate([
                'id' => $nextQueue->id,
                'name' => $nextQueue->getName(),
                'number' => $nextQueue->number,
                'state' => $nextQueue->state,
            ]));
            Cache::put('activeQueue', $nextQueue);
        } else {
            Cache::forget('activeQueue');
        }
    }

    private function updateQueue(Queue $queue, Request $request)
    {
        $newNumber = $request->input('newNumber');

        $queue->number = $newNumber ?: $queue->number;
        $queue->save();
    }
}
