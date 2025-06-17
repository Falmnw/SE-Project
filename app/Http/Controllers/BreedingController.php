<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\File;
use App\Http\Controllers\LoginController;

class BreedingController extends Controller
{
    private function loadRequests()
    {
        $jsonPath = storage_path('app/breeding_requests.json');
        if (!File::exists($jsonPath)) {
            File::put($jsonPath, json_encode([]));
        }

        return json_decode(File::get($jsonPath), true);
    }

    private function saveRequests($requests)
    {
        $jsonPath = storage_path('app/breeding_requests.json');
        File::put($jsonPath, json_encode($requests, JSON_PRETTY_PRINT));
    }

    // GET: /api/breeding-requests
    public function index(Request $request)
    {
        

        $requests = $this->loadRequests();
        return response()->json($requests);
    }

    // POST: /api/breeding-requests
    public function store(Request $request)
    {
        if ($request->isMethod('options')) {
            return response()->noContent();
        }

        if (!$request->isMethod('post')) {
            return response()->json(['error' => 'Method not allowed'], 405);
        }
        Log::info('Request Headers:', $request->headers->all());
        Log::info('Request Body:', $request->all());
        $user = LoginController::verifyToken($request);
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        Log::info('Breeding request masuk');
        $validated = $request->validate([
            'email_from' => 'required|email',
            'owner_email' => 'required|email',
            'pet_to' => 'required|string',
            'message' => 'nullable|string',
        ]);

        $requests = $this->loadRequests();

        $newRequest = [
            'id' => count($requests) + 1,
            'email_from' => $validated['email_from'],
            'owner_email' => $validated['owner_email'],
            'pet_to' => $validated['pet_to'],
            'message' => $validated['message'] ?? '',
            'status' => 'pending',
            'created_at' => now()->toISOString()
        ];

        $requests[] = $newRequest;
        $this->saveRequests($requests);

        return response()->json(['message' => 'Request created', 'data' => $newRequest], 201);
    }

    // PUT: /api/breeding-requests/{id}
    public function update(Request $request, $id)
    {
        $user = LoginController::verifyToken($request);
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $requests = $this->loadRequests();
        $index = collect($requests)->search(fn($r) => $r['id'] == $id);

        if ($index === false) {
            return response()->json(['error' => 'Request not found'], 404);
        }

        $status = $request->input('status');
        if (!in_array($status, ['pending', 'accepted', 'rejected'])) {
            return response()->json(['error' => 'Invalid status'], 400);
        }

        $requests[$index]['status'] = $status;
        $this->saveRequests($requests);

        // Jika accepted, buat chat privat
        if ($status === 'accepted') {
            $email1 = $requests[$index]['email_from'];
            $email2 = $requests[$index]['owner_email'];
            $chatFile = $this->generateChatFilename($email1, $email2);

            if (!Storage::exists("chats/$chatFile")) {
                Storage::put("chats/$chatFile", json_encode([]));
            }
        }

        return response()->json(['message' => 'Request updated', 'data' => $requests[$index]]);
    }

    private function generateChatFilename($email1, $email2)
    {
        $emails = [$email1, $email2];
        sort($emails);
        return 'chats_' . md5(implode('-', $emails)) . '.json';
    }

    public function getPrivateChat(Request $request)
    {
        $user1 = $request->query('user1');
        $user2 = $request->query('user2');

        if (!$user1 || !$user2) {
            return response()->json(['error' => 'Both user1 and user2 are required'], 400);
        }

        $chatFile = $this->generateChatFilename($user1, $user2);
        if (!Storage::exists("chats/$chatFile")) {
            return response()->json([]);
        }

        return response()->json(json_decode(Storage::get("chats/$chatFile"), true));
    }
    public function sendPrivate(Request $request) 
    {
        $user = LoginController::verifyToken($request);
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $validated = $request->validate([
        'from' => 'required|email',
        'to' => 'required|email',
        'text' => 'required|string|max:1000'
    ]);

        $email1 = $validated['from'];
        $email2 = $validated['to'];
        $chatFile = $this->generateChatFilename($email1, $email2);
        $chatPath = "chats/$chatFile";

        // Ambil chat lama
        $chatData = Storage::exists($chatPath)
            ? json_decode(Storage::get($chatPath), true)
            : [];

        // Tambahkan pesan baru
        $chatData[] = [
            'from' => $validated['from'],
            'to' => $validated['to'],
            'text' => $validated['text'],
            'time' => now()->toDateTimeString(),
        ];

        Storage::put($chatPath, json_encode($chatData, JSON_PRETTY_PRINT));

        return response()->json(['message' => 'Pesan terkirim'], 200);
    }
}
