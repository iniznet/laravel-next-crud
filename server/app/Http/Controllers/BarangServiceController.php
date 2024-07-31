<?php

namespace App\Http\Controllers;

use App\Models\BarangService;
use App\Http\Controllers\Controller;
use App\Http\Requests\BarangServiceRequest;

class BarangServiceController extends Controller
{
    public function index()
    {
        return response()->json(BarangService::all());
    }

    public function store(BarangServiceRequest $request)
    {
        $barangService = BarangService::create($request->validated());
        return response()->json($barangService, 201);
    }

    public function show(BarangService $barangService)
    {
        return response()->json($barangService);
    }

    public function update(BarangServiceRequest $request, BarangService $barangService)
    {
        $barangService->update($request->validated());
        return response()->json($barangService);
    }

    public function destroy(BarangService $barangService)
    {
        $barangService->delete();
        return response()->json(null, 204);
    }
}
