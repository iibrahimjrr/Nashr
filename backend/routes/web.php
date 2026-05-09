<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json(['message' => 'Nashr API is running', 'version' => '1.0']);
});
