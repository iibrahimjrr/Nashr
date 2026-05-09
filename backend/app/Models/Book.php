<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'author',
        'category',
        'cover',
        'readlink',
        'description',
        'rating',
    ];

    protected function casts(): array
    {
        return [
            'rating' => 'float',
        ];
    }

    /* ── Relationships ── */

    public function favoritedBy()
    {
        return $this->belongsToMany(User::class, 'user_favorites')
                    ->withTimestamps();
    }

    public function savedBy()
    {
        return $this->belongsToMany(User::class, 'user_saved')
                    ->withTimestamps();
    }
}
