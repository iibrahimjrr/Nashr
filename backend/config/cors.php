<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    /*
     * With supports_credentials => true, browsers forbid allowed_origins => ['*'].
     * Set FRONTEND_URL in .env (e.g. https://your-app.vercel.app) for production.
     */
    'allowed_origins' => array_values(array_unique(array_filter(array_merge(
        [
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'http://192.168.1.6:3000',
        ],
        [env('FRONTEND_URL')],
    )))),

    'allowed_origins_patterns' => [
        '#^https://.*\.vercel\.app$#',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];