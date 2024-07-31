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
        $notaServices = NotaService::with(['selectedServices', 'barangList'])->get();

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
                'selectedServices' => $notaService->selectedServices->map(function ($service) {
                    return [
                        'KODE' => $service->KODE,
                        'KETERANGAN' => '',
                        'ESTIMASIHARGA' => $service->HARGA
                    ];
                }),
                'barangList' => $notaService->barangList
            ];
        });

        return response()->json($notaServices);
    }

    public function store(NotaServiceRequest $request)
    {
        $data = $request->validated();

        // Validate and generate unique FAKTUR
        $data['FAKTUR'] = $this->checkFakturUnique($data['FAKTUR']);

        // Validate and generate unique KODE
        $data['KODE'] = $this->checkKodeUnique($data['KODE']);

        // Add current username
        $data['USERNAME'] = auth()->user()->name;

        // Set DATETIME
        $data['DATETIME'] = now();

        // Create the NotaService entry
        $notaService = NotaService::create($data);

        // Process and save selected services
        $i = 1;
        foreach ($request->input('selectedServices', []) as $service) {
            SparepartService::create([
                'KODE_SERVICE' => $notaService->KODE,
                'KODE_BARANG' => $i++,
                'KODE' => $service['KODE'],
                'HARGA' => $service['ESTIMASIHARGA'],
                'STATUS' => 0
            ]);
        }

        // Process and save barang list
        foreach ($request->input('barangList', []) as $barang) {
            BarangService::create([
                'KODE_SERVICE' => $notaService->KODE,
                'KODE' => $barang['KODE'],
                'NAMA' => $barang['NAMA'],
                'KETERANGAN' => $barang['KETERANGAN'],
                'QTY' => $barang['QTY'] ?? 1, // Default quantity if not provided
                'STATUSAMBIL' => $barang['STATUSAMBIL']
            ]);
        }

        return response()->json($notaService, 201);
    }

    public function show($faktur)
    {
        $notaService = NotaService::with(['selectedServices', 'barangList'])->where('FAKTUR', $faktur)->firstOrFail();
        return response()->json($notaService);
    }

    public function update(NotaServiceRequest $request, NotaService $notaService)
    {
        $data = $request->validated();

        $notaService->update($data);

        // Process and save selected services
        $notaService->selectedServices()->delete();
        $i = 1;
        foreach ($request->input('selectedServices', []) as $service) {
            SparepartService::create([
                'KODE_SERVICE' => $notaService->KODE,
                'KODE_BARANG' => $i++,
                'KODE' => $service['KODE'],
                'HARGA' => $service['ESTIMASIHARGA'],
                'STATUS' => 0
            ]);
        }

        // Process and save barang list
        $notaService->barangList()->delete();
        foreach ($request->input('barangList', []) as $barang) {
            BarangService::create([
                'KODE_SERVICE' => $notaService->KODE,
                'KODE' => $barang['KODE'],
                'NAMA' => $barang['NAMA'],
                'KETERANGAN' => $barang['KETERANGAN'],
                'QTY' => $barang['QTY'] ?? 1, // Default quantity if not provided
                'STATUSAMBIL' => $barang['STATUSAMBIL']
            ]);
        }

        return response()->json($notaService);
    }

    public function destroy(NotaService $notaService)
    {
        $notaService->selectedServices()->delete();
        $notaService->barangList()->delete();
        $notaService->delete();
        return response()->json(null, 204);
    }

    public function bulkDestroy()
    {
        $ids = request()->validate([
            'ids' => 'required|array',
            'ids.*' => 'string|exists:notaservice,FAKTUR'
        ])['ids'];

        NotaService::whereIn('FAKTUR', $ids)->delete();

        foreach ($ids as $id) {
            SparepartService::where('KODE_SERVICE', $id)->delete();
            BarangService::where('KODE_SERVICE', $id)->delete();
        }

        return response()->json(null, 204);
    }

    // generate new faktur and kode
    public function serial(Request $request)
    {
        $request->validate([
            'FAKTUR' => 'required|string|max:50',
            'KODE' => 'required|string|max:20'
        ]);

        $faktur = $this->checkFakturUnique($request->FAKTUR);
        $kode = $this->checkKodeUnique($request->KODE);

        return response()->json([
            'FAKTUR' => $faktur,
            'KODE' => $kode
        ]);
    }

    public function newIdentifiers()
    {
        $faktur = $this->generateFaktur();
        $kode = $this->generateKode();

        return response()->json([
            'FAKTUR' => $faktur,
            'KODE' => $kode
        ]);
    }

    private function generateFaktur(string $prefix = 'PSV'): string
    {
        $now = now();
        $datePart = $now->format('ymd');
        $sequencePart = '00000001';
        return $this->checkFakturUnique($prefix . $datePart . $sequencePart);
    }

    private function generateKode(string $prefix = 'SV'): string
    {
        $now = now();
        $datePart = $now->format('ymd');
        $sequencePart = '00000001';
        return $this->checkKodeUnique($prefix . $datePart . $sequencePart);
    }

    private function checkFakturUnique(string $faktur): string
    {
        $originalFaktur = $faktur;
        $counter = 1;

        // PSV24073000000001 -> PSV24073000000002
        while (NotaService::where('FAKTUR', $faktur)->exists()) {
            $faktur = substr($originalFaktur, 0, -2) . str_pad($counter++, 2, '0', STR_PAD_LEFT);
        }

        return $faktur;
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
