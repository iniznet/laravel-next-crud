<?php

namespace App\Http\Controllers;

use App\Models\Receipt;
use App\Http\Requests\StoreReceiptRequest;
use App\Http\Requests\UpdateReceiptRequest;

class ReceiptController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $receipt = Receipt::all();

        return response()->json($receipt);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReceiptRequest $request)
    {
        $receipt = Receipt::create($request->except('items'));

        $receipt->items()->createMany($request->items);

        return response()->json($receipt, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Receipt $receipt)
    {
        return response()->json($receipt);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReceiptRequest $request, Receipt $receipt)
    {
        $receipt->update($request->except('items'));

        $receipt->items()->delete();

        $receipt->items()->createMany($request->items);

        return response()->json($receipt);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Receipt $receipt)
    {
        $receipt->delete();

        return response()->json($receipt, 204);
    }
}
