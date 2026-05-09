<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'role',
        'avatar',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
        ];
    }

    /* ── Relationships ── */

    public function favorites()
    {
        return $this->belongsToMany(Book::class, 'user_favorites')
                    ->withTimestamps();
    }

    public function savedBooks()
    {
        return $this->belongsToMany(Book::class, 'user_saved')
                    ->withTimestamps();
    }

    /* ── Helpers ── */

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }
}
