<?php

namespace App\Http\Controllers;

use App\Models\SparePart;
use App\Http\Requests\StoreSparePartRequest;
use App\Http\Requests\UpdateSparePartRequest;

class SparePartController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $spareParts = SparePart::all();

        return response()->json($spareParts);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSparePartRequest $request)
    {
        $sparePart = SparePart::create($request->validated());

        return response()->json($sparePart, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(SparePart $sparePart)
    {
        return response()->json($sparePart);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSparePartRequest $request, SparePart $sparePart)
    {
        $sparePart->update($request->validated());

        return response()->json($sparePart);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SparePart $sparePart)
    {
        $sparePart->delete();

        return response()->json($sparePart, 204);
    }
}
