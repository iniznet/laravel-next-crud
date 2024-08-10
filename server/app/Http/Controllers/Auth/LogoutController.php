<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Auth;
use Illuminate\Http\Request;

class LogoutController extends Controller
{
    public function __invoke(Request $request)
    {
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        Auth::logout();

        return response()->json([
            'message' => __('Successfully logged out'),
        ]);
    }
}
