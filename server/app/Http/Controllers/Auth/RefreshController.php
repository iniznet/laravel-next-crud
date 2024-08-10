<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class RefreshController extends Controller
{
    public function __invoke()
    {
        try {
            $token = JWTAuth::parseToken()->refresh();
            $refreshToken = JWTAuth::manager()->getPayloadFactory()->make([
                'sub' => auth()->user()->id,
                'iat' => time(),
                'exp' => time() + config('jwt.refresh_ttl') * 60
            ])->get();

            return response()->json([
                'access_token' => $token,
                'refresh_token' => $refreshToken,
                'token_type' => 'bearer',
                'expires_in' => JWTAuth::factory()->getTTL() * 60
            ]);
        } catch (JWTException $e) {
            return response()->json(['error' => 'Could not refresh token'], 401);
        }
    }
}
