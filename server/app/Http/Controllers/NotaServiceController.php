<?php

namespace App\Http\Controllers;

use App\Models\NotaService;
use App\Http\Controllers\Controller;
use App\Http\Requests\NotaServiceRequest;

class NotaServiceController extends Controller
{
    public function index()
    {
        return response()->json(NotaService::all());
    }

    public function store(NotaServiceRequest $request)
    {
        $notaService = NotaService::create($request->validated());
        return response()->json($notaService, 201);
    }

    public function show(NotaService $notaService)
    {
        return response()->json($notaService);
    }

    public function update(NotaServiceRequest $request, NotaService $notaService)
    {
        $notaService->update($request->validated());
        return response()->json($notaService);
    }

    public function destroy(NotaService $notaService)
    {
        $notaService->delete();
        return response()->json(null, 204);
    }
}
