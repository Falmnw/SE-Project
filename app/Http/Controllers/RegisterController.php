<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;

class RegisterController extends Controller
{
    private function createTableIfNotExists()
    {
        DB::statement("
            CREATE TABLE IF NOT EXISTS accounts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100),
                email VARCHAR(100) UNIQUE,
                password VARCHAR(255),
                phone VARCHAR(20)
            )
        ");
    }

    public function register(Request $request)
    {
        if ($request->isMethod('options')) {
            return response()->noContent();
        }

        if (!$request->isMethod('post')) {
            return response()->json(['error' => 'Method not allowed'], 405);
        }
        
        $this->createTableIfNotExists(); // <- Buat tabel dulu kalau belum ada

        $data = $request->only(['name', 'email', 'password', 'phone']);

        if (empty($data['email']) || empty($data['password'])) {
            return response()->json(['error' => 'Invalid request'], 400);
        }

        // Cek apakah email sudah terdaftar
        $existing = DB::table('accounts')->where('email', $data['email'])->first();
        if ($existing) {
            return response()->json(['error' => 'Email sudah terdaftar'], 409);
        }

        // Simpan ke database (hash password)
        DB::table('accounts')->insert([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'phone' => $data['phone'] ?? null,
        ]);

        Log::info("New user registered: {$data['name']} <{$data['email']}>");

        return response()->json(['message' => 'Register success'], 201);
    }

    public function acc(Request $request)
    {
        if (!$request->isMethod('get')) {
            return response()->json(['error' => 'Method not allowed'], 405);
        }

        $accounts = DB::table('accounts')->select('id', 'name', 'email', 'phone')->get();

        return response()->json($accounts, 200, [], JSON_PRETTY_PRINT);
    }

    public function home(Request $request)
    {
        if (!$request->isMethod('get')) {
            return response()->json(['error' => 'Method not allowed'], 405);
        }

        return response()->json(['message' => 'Hai :v']);
    }
}
