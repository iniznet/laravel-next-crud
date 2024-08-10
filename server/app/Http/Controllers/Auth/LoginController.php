<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Controllers\Concerns\ApiResponse;
use Symfony\Component\HttpFoundation\Response;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class LoginController extends Controller
{
    use ApiResponse;

    public function __invoke(LoginRequest $request)
    {
        if (Auth::check()) {
            return $this->respondAuthenticated(__('You are already authenticated!'), Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $credentials = $request->validated();

        if (!$token = JWTAuth::attempt($credentials)) {
            return $this->respondNotFound(__('Login failed. Please check your credentials.'));
        }

        $user = Auth::user();
        $refreshToken = $this->createRefreshToken($user);

        return $this->respondWithSuccess(
            __('Successfully logged in, please wait...'),
            [
                'user' => $user,
                'access_token' => $token,
                'refresh_token' => $refreshToken,
                'token_type' => 'bearer',
                'expires_in' => JWTAuth::factory()->getTTL() * 60 // Fixed this line
            ]
        );
    }

    protected function createRefreshToken($user)
    {
        return JWTAuth::getJWTProvider()->encode([
            'sub' => $user->id,
            'iat' => time(),
            'exp' => time() + config('jwt.refresh_ttl') * 60
        ]);
    }
}
