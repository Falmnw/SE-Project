<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use App\Models\Pet;



class PetController extends Controller
{

    public function allPats(Request $request)
        {
        $user = LoginController::verifyToken($request);
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        
        if (Schema::hasTable('pets')) {
            $pets = DB::table('pets')->get();
            return response()->json($pets);
        } else {
            DB::statement("
                CREATE TABLE IF NOT EXISTS pets (
                    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    type VARCHAR(255) NOT NULL,
                    breed VARCHAR(255),
                    gender VARCHAR(255) NOT NULL,
                    age INT NOT NULL,
                    region VARCHAR(255),
                    owner_email VARCHAR(255) NOT NULL,
                    image_path VARCHAR(255),
                    created_at TIMESTAMP NULL DEFAULT NULL,
                    updated_at TIMESTAMP NULL DEFAULT NULL
                )
            ");
            $pets = collect();
            return response()->json($pets);
        }

    }

    // Ambil semua hewan milik user tertentu
    public function showByOwner($email ,Request $request)
        {
        $user = LoginController::verifyToken($request);
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        // $user = auth()->user();
        if ($user['email'] !== $email) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        
        if (Schema::hasTable('pets')) {
            $pets = DB::table('pets')->where('owner_email', $email)->get();
            return response()->json($pets);
        } else {
            DB::statement("
                CREATE TABLE IF NOT EXISTS pets (
                    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    type VARCHAR(255) NOT NULL,
                    breed VARCHAR(255),
                    gender VARCHAR(255) NOT NULL,
                    age INT NOT NULL,
                    region VARCHAR(255),
                    owner_email VARCHAR(255) NOT NULL,
                    image_path VARCHAR(255),
                    created_at TIMESTAMP NULL DEFAULT NULL,
                    updated_at TIMESTAMP NULL DEFAULT NULL
                )
            ");
            $pets = collect();
            return response()->json($pets);
        }

    }

    // Tambah hewan baru
    public function store(Request $request)
    {
        $user = LoginController::verifyToken($request);
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $request->validate([
            'name' => 'required|string',
            'type' => 'required|string',
            'gender' => 'required|string|in:Jantan,Betina',
            'age' => 'required|integer|min:0',
            'owner' => 'required|email',
            'image' => 'required|image|max:5120',
            'breed' => 'nullable|string',   // 🆕 tambahkan ini
            'region' => 'nullable|string',  // 🆕 dan ini
        ]);

        // Simpan file ke storage/app/public/pets
        $path = $request->file('image')->store('pets', 'public');
        $url = Storage::url($path);

        $pet = Pet::create([
            'name' => $request->name,
            'type' => $request->type,
            'breed' => $request->breed,         // 🆕
            'gender' => $request->gender,
            'age' => $request->age,
            'region' => $request->region,       // 🆕
            'owner_email' => $request->owner,
            'image_path' => $url,
        ]);

        return response()->json($pet, 201);
    }

    // Hapus hewan peliharaan (opsional)
    public function destroy($id, Request $request)
    {
        $user = LoginController::verifyToken($request);
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $pet = Pet::findOrFail($id);

        // Hapus gambar dari storage
        if ($pet->image_path) {
            $path = str_replace('/storage', 'public', $pet->image_path);
            Storage::delete($path);
        }

        $pet->delete();

        return response()->json(['message' => 'Pet deleted']);
    }
}
