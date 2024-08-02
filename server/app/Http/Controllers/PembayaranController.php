<?php

namespace App\Http\Controllers;

use App\Http\Requests\PembayaranRequest;
use App\Models\NotaService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PembayaranController extends Controller
{
    public function index()
    {
        $pembayarans = NotaService::where('FAKTUR', '!=', '')->get();

        // rename the keys
        $pembayarans = $pembayarans->map(function ($pembayaran) {
            return [
                'ID' => $pembayaran->ID,
                'STATUS' => $pembayaran->STATUS,
                'FAKTUR' => $pembayaran->FAKTUR,
                'KODE' => $pembayaran->KODE,
                'TGL' => $pembayaran->TGL,
                'TGLBAYAR' => $pembayaran->TGLBAYAR,
                'PEMILIK' => $pembayaran->PEMILIK,
                'NOTELEPON' => $pembayaran->NOTELEPON,
                'ESTIMASISELESAI' => $pembayaran->ESTIMASISELESAI,
                'ESTIMASIHARGA' => $pembayaran->ESTIMASIHARGA,
                'HARGA' => $pembayaran->HARGA,
                'NOMINALBAYAR' => $pembayaran->NOMINALBAYAR,
                'DP' => $pembayaran->DP,
                'PENERIMA' => $pembayaran->PENERIMA,
                'DATETIME' => $pembayaran->DATETIME,
                'USERNAME' => $pembayaran->USERNAME,
            ];
        });

        return response()->json($pembayarans);
    }

    public function services()
    {
        $services = NotaService::where('FAKTUR', '=', '')->get();
        return response()->json($services);
    }

    public function store(PembayaranRequest $request)
    {
        $data = $request->validated();

        // update NotaService with the new data
        $pembayaran = NotaService::where('KODE', $data['KODE'])->firstOrFail();

        $pembayaran->update($data);

        return response()->json($pembayaran);
    }

    public function show(string $kode)
    {
        $pembayaran = NotaService::with(['selectedServices', 'barangList'])->where('KODE', $kode)->firstOrFail();

        $barangList = $pembayaran->barangList;

        $barangList = $barangList->map(function ($barang) use ($pembayaran) {
            $selectedServices = $pembayaran->selectedServices->where('KODE_BARANG', $barang->KODE);
            $barang->HARGA = $selectedServices->sum('HARGA');
            return $barang;
        });

        // rename the keys
        $pembayaran = [
            'ID' => $pembayaran->ID,
            'STATUS' => $pembayaran->STATUS,
            'FAKTUR' => $pembayaran->FAKTUR,
            'KODE' => $pembayaran->KODE,
            'TGL' => $pembayaran->TGL,
            'TGLBAYAR' => $pembayaran->TGLBAYAR,
            'PEMILIK' => $pembayaran->PEMILIK,
            'NOTELEPON' => $pembayaran->NOTELEPON,
            'ESTIMASISELESAI' => $pembayaran->ESTIMASISELESAI,
            'ESTIMASIHARGA' => $pembayaran->ESTIMASIHARGA,
            'HARGA' => $pembayaran->HARGA,
            'NOMINALBAYAR' => $pembayaran->NOMINALBAYAR,
            'DP' => $pembayaran->DP,
            'PENERIMA' => $pembayaran->PENERIMA,
            'DATETIME' => $pembayaran->DATETIME,
            'USERNAME' => $pembayaran->USERNAME,
            'barangList' => $barangList,
        ];

        return response()->json($pembayaran);
    }

    public function update(PembayaranRequest $request)
    {
        $data = $request->validated();

        // update NotaService with the new data
        $pembayaran = NotaService::where('KODE', $data['KODE'])->firstOrFail();

        $pembayaran->update($data);

        return response()->json($pembayaran);
    }

    public function destroy($id)
    {
        $pembayaran = NotaService::findOrFail($id);
        $pembayaran->delete();
        return response()->json(null, 204);
    }

    public function newIdentifiers()
    {
        $faktur = $this->generateFaktur();

        return response()->json([
            'FAKTUR' => $faktur
        ]);
    }

    public function getNotaServicesWithoutFaktur()
    {
        $notaServices = NotaService::whereNull('FAKTUR')->get(['KODE', 'PEMILIK']);
        return response()->json($notaServices);
    }

    public function getNotaServiceDetails($kode)
    {
        $notaService = NotaService::with('barangList')->where('KODE', $kode)->firstOrFail();
        return response()->json($notaService);
    }

    private function generateFaktur(string $prefix = 'PSV'): string
    {
        $now = now();
        $datePart = $now->format('ymd');
        $sequencePart = '00000001';
        return $this->checkFakturUnique($prefix . $datePart . $sequencePart);
    }

    private function checkFakturUnique(string $faktur): string
    {
        $originalFaktur = $faktur;
        $counter = 1;

        while (NotaService::where('FAKTUR', $faktur)->exists()) {
            $faktur = substr($originalFaktur, 0, -2) . str_pad($counter++, 2, '0', STR_PAD_LEFT);
        }

        return $faktur;
    }

    public function bulkDelete(Request $request)
    {
        $fakturs = $request->input('fakturs', []);

        DB::beginTransaction();
        try {
            NotaService::whereIn('FAKTUR', $fakturs)->delete();
            DB::commit();
            return response()->json(['message' => 'Pembayarans deleted successfully'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error deleting pembayarans'], 500);
        }
    }
}
