<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ApiResponse;
use App\Models\Stock;
use App\Http\Requests\StockRequest;
use Illuminate\Http\Request;

class StockController extends Controller
{
    use ApiResponse;

    public function index()
    {
        return response()->json(Stock::all());
    }

    public function store(StockRequest $request)
    {
        $data = $request->validated();

        $data['GUDANG'] = '01';
        $data['JENIS'] = 'B';
        $data['GOLONGAN'] = '01';
        $data['DOS'] = '1';
        $data['SATUAN'] = 'UNT';

        $stock = Stock::create($data);
        return response()->json($stock, 201);
    }

    public function show(string $id)
    {
        $stock = Stock::find($id);

        if (!$stock) {
            return $this->respondNotFound('Stock not found', 404);
        }

        return response()->json($stock);
    }

    public function update(StockRequest $request, string $id)
    {
        $stock = Stock::find($id);

        if (!$stock) {
            return $this->respondNotFound('Stock not found', 404);
        }

        $validatedData = $request->validated();

        // Convert any array values to JSON strings
        foreach ($validatedData as $key => $value) {
            if (is_array($value)) {
                $validatedData[$key] = json_encode($value);
            }
        }

        $stock->update($validatedData);
        return response()->json($stock);
    }

    public function destroy(string $id)
    {
        $stock = Stock::find($id);

        if (!$stock) {
            return $this->respondNotFound('Stock not found', 404);
        }

        $stock->delete();
        return response()->json(null, 204);
    }

    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:stock,ID'
        ]);

        Stock::destroy($request->input('ids'));

        return response()->json(null, 204);
    }

    public function getNewKode()
    {
        $lastStock = Stock::orderBy('KODE', 'desc')->first();
        $lastKode = $lastStock ? intval($lastStock->KODE) : 0;
        $newKode = str_pad($lastKode + 1, 10, '0', STR_PAD_LEFT);

        return response()->json(['kode' => $newKode]);
    }
}
