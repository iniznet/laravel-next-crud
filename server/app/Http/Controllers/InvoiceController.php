<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Http\Requests\StoreInvoiceRequest;
use App\Http\Requests\UpdateInvoiceRequest;
use Illuminate\Support\Facades\DB;

class InvoiceController extends Controller
{
    public function index()
    {
        $invoices = Invoice::with('items')->get();
        return response()->json($invoices);
    }

    public function store(StoreInvoiceRequest $request)
    {
        $validatedData = $request->validated();

        DB::beginTransaction();
        try {
            $invoice = Invoice::create($validatedData);
            $invoice->items()->createMany($validatedData['items']);
            DB::commit();
            return response()->json($invoice->load('items'), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error creating invoice'], 500);
        }
    }

    public function show(Invoice $invoice)
    {
        return response()->json($invoice->load('items'));
    }

    public function update(UpdateInvoiceRequest $request, Invoice $invoice)
    {
        $validatedData = $request->validated();

        DB::beginTransaction();
        try {
            $invoice->update($validatedData);

            // Update or create items
            foreach ($validatedData['items'] as $item) {
                if (isset($item['id'])) {
                    $invoice->items()->where('id', $item['id'])->update($item);
                } else {
                    $invoice->items()->create($item);
                }
            }

            // Remove items not in the update
            $updatedItemIds = collect($validatedData['items'])->pluck('id')->filter();
            $invoice->items()->whereNotIn('id', $updatedItemIds)->delete();

            DB::commit();
            return response()->json($invoice->fresh()->load('items'));
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error updating invoice'], 500);
        }
    }

    public function destroy(Invoice $invoice)
    {
        $invoice->delete();
        return response()->json(null, 204);
    }

    public function newIdentifiers()
    {
        $kode = $this->generateKode();

        return response()->json([
            'KODE' => $kode
        ]);
    }

    private function generateKode(string $prefix = 'INV'): string
    {
        $now = now();
        $datePart = $now->format('ymd');
        $sequencePart = '00000001';
        return $this->checkKodeUnique($prefix . $datePart . $sequencePart);
    }

    private function checkKodeUnique(string $kode): string
    {
        $originalKode = $kode;
        $counter = 1;

        while (Invoice::where('invoice_number', $kode)->exists()) {
            $kode = substr($originalKode, 0, -2) . str_pad($counter++, 2, '0', STR_PAD_LEFT);
        }

        return $kode;
    }
}
