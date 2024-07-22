<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RegisterController extends Controller
{
    use ApiResponse;

    public function __invoke(RegisterRequest $request)
    {
        $request->validated();

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return $this->respondCreated(
            __('Registration successful! Please log in with your new account.'),
            [
                'data' => $user,
            ]
        );
    }
}
