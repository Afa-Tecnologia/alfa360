<?php

namespace App\Http\Controllers\Health;

use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\Auth;

class HealthController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @return \Illuminate\Http\Response
     */
    public function check()
    {
        //Garantir apenas chamadas dentro do proprio servidor
        $allowedIps = ['127.0.0.1', '::1']; // localhost IPv4 e IPv6

        if (!in_array(request()->ip(), $allowedIps)) {
            return response()->json(['status' => 'forbidden'], 403);
        }
        
        try {
            $credentials = [
                'email' => env('HEALTHCHECK_EMAIL'),
                'password' => env('HEALTHCHECK_PASSWORD')
            ];

            if (Auth::attempt($credentials)) {
                return response()->json(['status' => 'ok'], 200);
            } else {
                return response()->json(['status' => 'fail'], 500);
            }
        } catch (\Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }


        }
}