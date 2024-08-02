<?php

namespace App\Http\Controllers;

use App\Models\NotaService;
use App\Models\BarangService;
use App\Models\SparepartService;
use App\Http\Controllers\Controller;
use App\Http\Requests\NotaServiceRequest;
use Illuminate\Http\Request;

class NotaServiceController extends Controller
{
    public function index()
    {
        $notaServices = NotaService::with(['barangList.services'])->get();

        // Rename the keys
        $notaServices = $notaServices->map(function ($notaService) {
            return [
                'ID' => $notaService->ID,
                'STATUS' => $notaService->STATUS,
                'FAKTUR' => $notaService->FAKTUR,
                'KODE' => $notaService->KODE,
                'TGL' => $notaService->TGL,
                'TGLBAYAR' => $notaService->TGLBAYAR,
                'PEMILIK' => $notaService->PEMILIK,
                'NOTELEPON' => $notaService->NOTELEPON,
                'ESTIMASISELESAI' => $notaService->ESTIMASISELESAI,
                'ESTIMASIHARGA' => $notaService->ESTIMASIHARGA,
                'HARGA' => $notaService->HARGA,
                'NOMINALBAYAR' => $notaService->NOMINALBAYAR,
                'DP' => $notaService->DP,
                'PENERIMA' => $notaService->PENERIMA,
                'DATETIME' => $notaService->DATETIME,
                'USERNAME' => $notaService->USERNAME,
                'barangList' => $notaService->barangList->map(function ($barang) {
                    return [
                        'KODE' => $barang->KODE,
                        'NAMA' => $barang->NAMA,
                        'KETERANGAN' => $barang->KETERANGAN,
                        'STATUSAMBIL' => $barang->STATUSAMBIL,
                        'services' => $barang->services->map(function ($service) {
                            return [
                                'KODE' => $service->KODE,
                                'HARGA' => $service->HARGA,
                            ];
                        }),
                    ];
                }),
            ];
        });

        return response()->json($notaServices);
    }

    public function store(NotaServiceRequest $request)
    {
        $data = $request->validated();

        // Validate and generate unique KODE
        $data['FAKTUR'] = '';
        $data['KODE'] = $this->checkKodeUnique($data['KODE']);

        // Add current username
        $data['USERNAME'] = auth()->user()->name;

        // Set DATETIME
        $data['DATETIME'] = now();

        // Calculate total ESTIMASIHARGA
        $data['ESTIMASIHARGA'] = collect($data['barangList'])->sum('ESTIMASIHARGA');

        // Create the NotaService entry
        $notaService = NotaService::create($data);

        // Process and save barang list with services
        foreach ($data['barangList'] as $barang) {
            $barangService = BarangService::create([
                'KODE_SERVICE' => $notaService->KODE,
                'KODE' => $barang['KODE'],
                'NAMA' => $barang['NAMA'],
                'KETERANGAN' => $barang['KETERANGAN'],
                'STATUSAMBIL' => $barang['STATUSAMBIL'],
                'ESTIMASIHARGA' => $barang['ESTIMASIHARGA'],
            ]);

            // Save services for each barang
            foreach ($barang['services'] as $service) {
                SparepartService::create([
                    'KODE_SERVICE' => $notaService->KODE,
                    'KODE_BARANG' => $barangService->KODE,
                    'KODE' => $service['KODE'],
                    'HARGA' => $service['HARGA'],
                    'STATUS' => 0
                ]);
            }
        }
    }

    public function show(string $faktur)
    {
        $notaService = NotaService::with(['selectedServices', 'barangList'])->where('FAKTUR', $faktur)->firstOrFail();
        return response()->json($notaService);
    }

    public function update(NotaServiceRequest $request, string $kode)
    {
        $data = $request->validated();

        // Calculate total ESTIMASIHARGA from barangList
        $data['ESTIMASIHARGA'] = collect($data['barangList'])->sum('ESTIMASIHARGA');

        $notaService = NotaService::where('KODE', $kode)->firstOrFail();

        $notaService->update($data);

        // Process and save barang list with services
        $notaService->barangList()->delete();
        $notaService->selectedServices()->delete();

        foreach ($data['barangList'] as $barang) {
            $barangService = BarangService::create([
                'KODE_SERVICE' => $notaService->KODE,
                'KODE' => $barang['KODE'],
                'NAMA' => $barang['NAMA'],
                'KETERANGAN' => $barang['KETERANGAN'],
                'STATUSAMBIL' => $barang['STATUSAMBIL'],
                'ESTIMASIHARGA' => $barang['ESTIMASIHARGA'],
            ]);

            // Save services for each barang
            foreach ($barang['services'] as $service) {
                SparepartService::create([
                    'KODE_SERVICE' => $notaService->KODE,
                    'KODE_BARANG' => $barangService->KODE,
                    'KODE' => $service['KODE'],
                    'HARGA' => $service['HARGA'],
                    'STATUS' => 0
                ]);
            }
        }

        return response()->json($notaService);
    }

    public function destroy(string $kode)
    {
        $notaService = NotaService::where('KODE', $kode)->firstOrFail();

        $notaService->selectedServices()->delete();
        $notaService->barangList()->delete();
        $notaService->delete();

        return response()->json(null, 204);
    }

    public function bulkDestroy()
    {
        $ids = request()->validate([
            'ids' => 'required|array',
            'ids.*' => 'string|exists:notaservice,KODE'
        ])['ids'];

        NotaService::whereIn('KODE', $ids)->delete();

        foreach ($ids as $id) {
            SparepartService::where('KODE_SERVICE', $id)->delete();
            BarangService::where('KODE_SERVICE', $id)->delete();
        }

        return response()->json(null, 204);
    }

    // generate new faktur and kode
    public function newIdentifiers()
    {
        $kode = $this->generateKode();

        return response()->json([
            'KODE' => $kode
        ]);
    }

    private function generateKode(string $prefix = 'SV'): string
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

        // SV24073000000001 -> SV24073000000002
        while (NotaService::where('KODE', $kode)->exists()) {
            $kode = substr($originalKode, 0, -2) . str_pad($counter++, 2, '0', STR_PAD_LEFT);
        }

        return $kode;
    }
}
