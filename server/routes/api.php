<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\MasterJasaController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\NotaServiceController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\BarangServiceController;
use App\Http\Controllers\SparepartServiceController;
use App\Http\Controllers\Auth\AuthenticatedController;

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('barang-service', BarangServiceController::class);
    Route::apiResource('master-jasa', MasterJasaController::class);
    Route::apiResource('nota-service', NotaServiceController::class);
    Route::apiResource('sparepart-service', SparepartServiceController::class);

    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});

Route::prefix('auth')->group(function () {
    Route::get('/', AuthenticatedController::class);
    Route::post('register', RegisterController::class);
    Route::post('login', LoginController::class);
    Route::post('logout', LogoutController::class);
});
