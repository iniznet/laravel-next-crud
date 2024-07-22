<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    use ApiResponse;

    public function __invoke(LoginRequest $request)
    {
        if (Auth::check()) {
            return $this->respondAuthenticated(__('You are already authenticated!'));
        }

        $credentials = $request->validated();

        if (Auth::attempt($credentials, $request->remember ?? false)) {
            $request->session()->regenerate();

            $user = Auth::user();
            $token = $user->createToken('authToken')->plainTextToken;

            return $this->respondWithSuccess(
                __('Successfully logged in, please wait...'),
                [
                    'data' => $user,
                    'token' => $token,
                ]
            );
        }

        return $this->respondNotFound(__('Login failed. Please check your credentials.'));
    }
}
