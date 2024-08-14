<?php

namespace App\Http\Controllers;

use App\Models\NotaService;
use App\Models\BarangService;
use App\Models\SparepartService;
use App\Http\Controllers\Controller;
use App\Http\Requests\NotaServiceRequest;
use App\Models\MasterJasa;
use App\Models\Queue;
use App\Models\Stock;
use DB;
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
                'ANTRIAN' => $notaService->queue->number ?? null,
                'barangList' => $notaService->barangList->map(function ($barang) {
                    return [
                        'KODE' => $barang->KODE,
                        'NAMA' => $barang->NAMA,
                        'KETERANGAN' => $barang->KETERANGAN,
                        'STATUSAMBIL' => $barang->STATUSAMBIL,
                        'services' => ($barang->services()->where(
                            'KODE_BARANG',
                            $barang->KODE
                        )->get())->map(function ($service) {
                            return [
                                'KODE' => $service->KODE,
                                'NAMA' => $service->barang->NAMA ?? $service->service->KETERANGAN,
                                'HARGA' => $service->HARGA,
                                'TYPE' => $service->STATUS === 'J' ? 'service' : 'stock'
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
                'QTY' => 1,
                'STATUSAMBIL' => $barang['STATUSAMBIL'],
            ]);

            // Save services and stock items for each barang
            foreach ($barang['services'] as $item) {
                SparepartService::create([
                    'KODE_SERVICE' => $notaService->KODE,
                    'KODE_BARANG' => $barangService->KODE,
                    'KODE' => $item['KODE'],
                    'HARGA' => $item['HARGA'],
                    'STATUS' => $item['TYPE'] === 'service' ? 'J' : 'B'
                ]);
            }
        }

        return response()->json($notaService, 201);
    }

    public function show(string $kode)
    {
        $notaService = NotaService::with(['barangList.services'])->where('KODE', $kode)->firstOrFail();

        $notaService = [
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
            'ANTRIAN' => $notaService->queue->number ?? null,
            'barangList' => $notaService->barangList->map(function ($barang) {
                return [
                    'KODE' => $barang->KODE,
                    'NAMA' => $barang->NAMA,
                    'KETERANGAN' => $barang->KETERANGAN,
                    'STATUSAMBIL' => $barang->STATUSAMBIL,
                    'services' => ($barang->services()->where(
                        'KODE_BARANG',
                        $barang->KODE
                    )->get())->map(function ($service) {
                        return [
                            'KODE' => $service->KODE,
                            'NAMA' => $service->barang->NAMA ?? $service->service->KETERANGAN,
                            'HARGA' => $service->HARGA,
                            'TYPE' => $service->STATUS === 'J' ? 'service' : 'stock'
                        ];
                    }),
                ];
            }),
        ];

        return response()->json($notaService);
    }

    public function update(NotaServiceRequest $request, string $kode)
    {
        $data = $request->validated();

        // Calculate total ESTIMASIHARGA from barangList
        $data['ESTIMASIHARGA'] = collect($data['barangList'])->sum('ESTIMASIHARGA');

        $notaService = NotaService::where('KODE', $kode)->firstOrFail();
        $notaService->fill($data)->save();

        // Process and save barang list with services
        $notaService->barangList()->delete();
        SparepartService::where('KODE_SERVICE', $notaService->KODE)->delete();

        foreach ($data['barangList'] as $barang) {
            $barangService = BarangService::create([
                'KODE_SERVICE' => $notaService->KODE,
                'KODE' => $barang['KODE'],
                'NAMA' => $barang['NAMA'],
                'KETERANGAN' => $barang['KETERANGAN'],
                'QTY' => 1,
                'STATUSAMBIL' => $barang['STATUSAMBIL'],
            ]);

            // Save services and stock items for each barang
            foreach ($barang['services'] as $item) {
                SparepartService::create([
                    'KODE_SERVICE' => $notaService->KODE,
                    'KODE_BARANG' => $barangService->KODE,
                    'KODE' => $item['KODE'],
                    'HARGA' => $item['HARGA'],
                    'STATUS' => $item['TYPE'] === 'service' ? 'J' : 'B'
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

    public function servicesStock()
    {
        $services = MasterJasa::select('KODE', 'KETERANGAN', 'ESTIMASIHARGA')
            ->addSelect(DB::raw("'service' as TYPE"))
            ->get();

        $stock = Stock::select('KODE', 'NAMA as KETERANGAN', 'HJ as ESTIMASIHARGA', 'SATUAN')
            ->addSelect(DB::raw("'stock' as TYPE"))
            ->get();

        $servicesAndStock = $services->concat($stock);

        return response()->json($servicesAndStock);
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
