<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AdminController;

/*
|--------------------------------------------------------------------------
| API Routes – EgyBooks
|--------------------------------------------------------------------------
|
| Public  : /api/auth/*
| Private : /api/* (requires sanctum token)
| Admin   : /api/admin/* (requires sanctum + admin role)
|
*/

/* ── Auth (Public) ──────────────────────────────────── */
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login',    [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me',      [AuthController::class, 'me']);
    });
});

/* ── Books (read: public, write: admin) ─────────────── */
Route::get('books',        [BookController::class, 'index']);
Route::get('books/{book}', [BookController::class, 'show']);

/* ── Authenticated User Routes ──────────────────────── */
Route::middleware('auth:sanctum')->group(function () {

    /* User profile */
    Route::get('user/profile',         [UserController::class, 'profile']);
    Route::put('user/profile',         [UserController::class, 'updateProfile']);
    Route::put('user/password',        [UserController::class, 'changePassword']);
    Route::post('user/avatar',         [UserController::class, 'uploadAvatar']);

    /* Favorites */
    Route::get('user/favorites',             [UserController::class, 'favorites']);
    Route::post('user/favorites/{book}',     [UserController::class, 'addFavorite']);
    Route::delete('user/favorites/{book}',   [UserController::class, 'removeFavorite']);

    /* Saved */
    Route::get('user/saved',                 [UserController::class, 'saved']);
    Route::post('user/saved/{book}',         [UserController::class, 'addSaved']);
    Route::delete('user/saved/{book}',       [UserController::class, 'removeSaved']);

    /* ── Admin Routes ───────────────────────────────── */
    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('dashboard',         [AdminController::class, 'dashboard']);
        Route::get('users',             [AdminController::class, 'users']);
        Route::delete('users/{user}',   [AdminController::class, 'deleteUser']);

        Route::post('books',            [BookController::class, 'store']);
        Route::put('books/{book}',      [BookController::class, 'update']);
        Route::delete('books/{book}',   [BookController::class, 'destroy']);
    });
});
