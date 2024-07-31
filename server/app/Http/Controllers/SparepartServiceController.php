<?php

namespace App\Http\Controllers;

use App\Models\SparepartService;
use App\Http\Controllers\Controller;
use App\Http\Requests\SparepartServiceRequest;

class SparepartServiceController extends Controller
{
    public function index()
    {
        return response()->json(SparepartService::all());
    }

    public function store(SparepartServiceRequest $request)
    {
        $sparepartService = SparepartService::create($request->validated());
        return response()->json($sparepartService, 201);
    }

    public function show(SparepartService $sparepartService)
    {
        return response()->json($sparepartService);
    }

    public function update(SparepartServiceRequest $request, SparepartService $sparepartService)
    {
        $sparepartService->update($request->validated());
        return response()->json($sparepartService);
    }

    public function destroy(SparepartService $sparepartService)
    {
        $sparepartService->delete();
        return response()->json(null, 204);
    }

}
