<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ApiResponse;
use App\Models\MasterJasa;
use App\Http\Controllers\Controller;
use App\Http\Requests\MasterJasaRequest;
use Illuminate\Http\Request;

class MasterJasaController extends Controller
{
    use ApiResponse;

    public function index()
    {
        return response()->json(MasterJasa::all());
    }

    public function store(MasterJasaRequest $request)
    {
        $masterJasa = MasterJasa::create($request->validated());
        return response()->json($masterJasa, 201);
    }

    public function show(string $id)
    {
        $masterJasa = MasterJasa::find($id);

        if (!$masterJasa) {
            return $this->respondNotFound('Jasa not found');
        }

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

    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'string|exists:master_jasa,KODE'
        ]);

        MasterJasa::destroy($request->input('ids'));

        return response()->json(null, 204);
    }
}
