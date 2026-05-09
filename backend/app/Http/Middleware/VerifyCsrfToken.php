<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * Exclude token-based API endpoints from CSRF validation.
     *
     * These endpoints authenticate via Sanctum personal access tokens,
     * not session cookies.
     *
     * @var array<int, string>
     */
    protected $except = [
        'api/*',
    ];
}
