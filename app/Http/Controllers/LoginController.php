<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class LoginController extends Controller
{
    private function generateJWT($user)
    {
        $payload = [
            'iss' => 'purrfectmate',
            'sub' => $user->email,
            'email' => $user->email,
            'name' => $user->name,
            'iat' => time(),
            'exp' => time() + (60 * 60 * 24), // 24 jam
        ];

        $secret = env('JWT_SECRET', 'fallback_key');
        return JWT::encode($payload, $secret, 'HS256');
    }
    public static function verifyToken(Request $request)
    {
        $authHeader = $request->header('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return null;
        }

        $token = substr($authHeader, 7); // hapus "Bearer "
        
        try {
            $decoded = JWT::decode($token, new Key(env('JWT_SECRET'), 'HS256'));
            return (array) $decoded; // isinya seperti: ['email' => 'x@y.com', 'name' => 'X']
        } catch (\Exception $e) {
            return null;
        }
    }

    public function login(Request $request)
    {
        if ($request->isMethod('options')) {
            return response()->noContent();
        }

        if (!$request->isMethod('post')) {
            return response()->json(['error' => 'Method not allowed'], 405);
        }

        $data = $request->only(['email', 'password']);

        if (empty($data['email']) || empty($data['password'])) {
            return response()->json(['error' => 'Email dan password wajib diisi'], 400);
        }

        // Ambil user dari DB
        $user = DB::table('accounts')->where('email', $data['email'])->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            return response()->json(['error' => 'Email atau password salah'], 401);
        }

        $token = $this->generateJWT($user);

        Log::info("Login sukses: {$user->email}");

        return response()->json([
            'message' => 'Login sukses',
            'token' => $token,
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
            ]
        ]);
    }
}
