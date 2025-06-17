<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use App\Http\Controllers\LoginController;

class ChatController extends Controller
{
    public function index()
    {
        $jsonPath = storage_path('app/chats.json');
        if (!File::exists($jsonPath)) {
            File::put($jsonPath, json_encode([]));
        }

        $data = json_decode(File::get($jsonPath), true);
        return response()->json($data);
    }
   

    public function store(Request $request)
    {
        $user = LoginController::verifyToken($request);
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $jsonPath = storage_path('app/chats.json');
        if (!File::exists($jsonPath)) {
            File::put($jsonPath, json_encode([]));
        }

        $chats = json_decode(File::get($jsonPath), true);

        $newChat = [
            'user' => $request->input('user'),
            'message' => $request->input('message'),
            'time' => now()->toDateTimeString(),
        ];

        $chats[] = $newChat;
        File::put($jsonPath, json_encode($chats, JSON_PRETTY_PRINT));

        return response()->json($newChat);
    }
}
