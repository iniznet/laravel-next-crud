<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\QueueController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\MasterJasaController;
use App\Http\Controllers\PembayaranController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\NotaServiceController;
use App\Http\Controllers\Auth\RefreshController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\BarangServiceController;
use App\Http\Controllers\SparepartServiceController;
use App\Http\Controllers\Auth\AuthenticatedController;

Route::apiResource('barang-service', BarangServiceController::class);

Route::post('master-jasa/bulk', [MasterJasaController::class, 'bulkDestroy'])->name('master-jasa.bulk-destroy');
Route::apiResource('master-jasa', MasterJasaController::class);

Route::get('nota-service/new-identifiers', [NotaServiceController::class, 'newIdentifiers'])->name('nota-service.new-identifiers');
Route::post('nota-service/bulk', [NotaServiceController::class, 'bulkDestroy'])->name('nota-service.bulk-destroy');
Route::apiResource('nota-service', NotaServiceController::class);
Route::get('services-stock', [NotaServiceController::class, 'servicesStock'])->name('services-stock');


Route::apiResource('sparepart-service', SparepartServiceController::class);

Route::get('pembayaran/new-identifiers', [PembayaranController::class, 'newIdentifiers'])->name('pembayaran.new-identifiers');
Route::get('pembayaran/services', [PembayaranController::class, 'services'])->name('pembayaran.services');
Route::post('pembayaran/bulk-destroy', [PembayaranController::class, 'bulkDestroy'])->name('pembayaran.bulk-destroy');
Route::apiResource('pembayaran', PembayaranController::class);

Route::get('stocks/new-kode', [StockController::class, 'getNewKode']);
Route::post('stocks/bulk-destroy', [StockController::class, 'bulkDestroy'])->name('stock.bulk-destroy');
Route::apiResource('stocks', StockController::class);

Route::get('invoices/new-identifiers', [InvoiceController::class, 'newIdentifiers'])->name('invoices.new-identifiers');
Route::post('invoisces/bulk-destroy', [InvoiceController::class, 'bulkDestroy'])->name('invoice.bulk-destroy');
Route::apiResource('invoices', InvoiceController::class);

Route::prefix('auth')->group(function () {
    Route::get('/', AuthenticatedController::class);
    Route::post('register', RegisterController::class);
    Route::post('login', LoginController::class);
    Route::post('refresh', RefreshController::class);
    Route::post('logout', LogoutController::class);
});


Route::get('/queue', [QueueController::class, 'index']);
Route::put('/queue', [QueueController::class, 'update']);
