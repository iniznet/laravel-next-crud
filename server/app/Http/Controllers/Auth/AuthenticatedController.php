<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class AuthenticatedController extends Controller
{
    use ApiResponse;

    public function __invoke()
    {
        if (!Auth::guard('sanctum')->check()) {
            return $this->respondUnAuthenticated(__('You are not authenticated!'));
        }

        return $this->respondAuthenticated(__('You are authenticated!'));
    }
}
