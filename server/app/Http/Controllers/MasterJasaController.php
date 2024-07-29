<?php

namespace App\Http\Controllers;

use App\Models\MasterJasa;
use App\Http\Controllers\Controller;
use App\Http\Requests\MasterJasaRequest;

class MasterJasaController extends Controller
{
    public function index()
    {
        return response()->json(MasterJasa::all());
    }

    public function store(MasterJasaRequest $request)
    {
        $masterJasa = MasterJasa::create($request->validated());
        return response()->json($masterJasa, 201);
    }

    public function show(MasterJasa $masterJasa)
    {
        return response()->json($masterJasa);
    }

    public function update(MasterJasaRequest $request, MasterJasa $masterJasa)
    {
        $masterJasa->update($request->validated());
        return response()->json($masterJasa);
    }

    public function destroy(MasterJasa $masterJasa)
    {
        $masterJasa->delete();
        return response()->json(null, 204);
    }

}
