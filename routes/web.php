<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RegisterController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/test', function () {
    return response()->json(['message' => 'Laravel jalan']);
});

Route::get('/testx', function () {
    return response()->json(['message x' => 'Laravel jalan x']);
});

// require __DIR__.'/api.php';
// Route::middleware('api')->group(function () {
//     require __DIR__.'/api.php';
// });

// Ini penting: kasih group API biar auto /api prefix dan bebas CSRF
// Route::prefix('api')->middleware('api')->group(function () {
//     require __DIR__.'/api.php';
// });

// Route::match(['post', 'options'], '/api/register', [RegisterController::class, 'register']);
// Route::get('/api/acc', [RegisterController::class, 'acc']);
// Route::get('/api/home', [RegisterController::class, 'home']);