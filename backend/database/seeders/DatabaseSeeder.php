<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        /* ── Admin User ── */
        User::firstOrCreate(
            ['username' => 'admin'],
            [
                'name'     => 'ibrahim',
                'email'    => 'ibrahim@gmail.com',
                'password' => Hash::make('123456789'),
                'role'     => 'admin',
            ]
        );

        /* ── Sample User ── */
        User::firstOrCreate(
            ['username' => 'testuser'],
            [
                'name'     => 'Test User',
                'email'    => 'user@nashr.com',
                'password' => Hash::make('password123'),
                'role'     => 'user',
            ]
        );

        /* ── Sample Books ── */
        $books = [
            ['title' => 'Anxious People',       'author' => 'Fredrik Backman',     'category' => 'Drama',     'rating' => 4.5, 'cover' => 'https://covers.openlibrary.org/b/id/10909258-L.jpg', 'description' => 'A poignant story about a failed bank robber who holds strangers hostage.'],
            ['title' => 'A Man Called Ove',     'author' => 'Fredrik Backman',     'category' => 'Drama',     'rating' => 4.7, 'cover' => 'https://covers.openlibrary.org/b/id/8231992-L.jpg',  'description' => 'A curmudgeon hides a warm heart behind a rough exterior.'],
            ['title' => 'The Paying Guests',    'author' => 'Sarah Waters',        'category' => 'Detective', 'rating' => 4.3, 'cover' => 'https://covers.openlibrary.org/b/id/7222246-L.jpg',  'description' => 'A widow takes in lodgers in 1920s London.'],
            ['title' => 'The Hobbit',           'author' => 'J.R.R. Tolkien',      'category' => 'Fantasy',   'rating' => 4.9, 'cover' => 'https://covers.openlibrary.org/b/id/8406786-L.jpg',  'description' => 'Bilbo Baggins embarks on an unexpected journey.'],
            ['title' => 'Marvel and a Wonder',  'author' => 'Joe Meno',            'category' => 'Drama',     'rating' => 4.1, 'cover' => 'https://covers.openlibrary.org/b/id/6979861-L.jpg',  'description' => 'A grandfather and grandson discover a mysterious horse.'],
            ['title' => 'The Great Gatsby',     'author' => 'F. Scott Fitzgerald', 'category' => 'Drama',     'rating' => 4.6, 'cover' => 'https://covers.openlibrary.org/b/id/8432209-L.jpg',  'description' => 'The mysterious Jay Gatsby and his obsession with Daisy.'],
            ['title' => 'Dune',                 'author' => 'Frank Herbert',       'category' => 'Fantasy',   'rating' => 4.8, 'cover' => 'https://covers.openlibrary.org/b/id/8231993-L.jpg',  'description' => 'Epic science fantasy on the desert planet Arrakis.'],
            ['title' => 'The Da Vinci Code',    'author' => 'Dan Brown',           'category' => 'Detective', 'rating' => 4.4, 'cover' => 'https://covers.openlibrary.org/b/id/8091016-L.jpg',  'description' => 'Robert Langdon investigates a murder in the Louvre.'],
            ['title' => 'Think and Grow Rich',  'author' => 'Napoleon Hill',       'category' => 'Business',  'rating' => 4.5, 'cover' => 'https://covers.openlibrary.org/b/id/7222244-L.jpg',  'description' => 'Classic guide to success through positive thinking.'],
            ['title' => '1984',                 'author' => 'George Orwell',       'category' => 'Drama',     'rating' => 4.8, 'cover' => 'https://covers.openlibrary.org/b/id/8575708-L.jpg',  'description' => 'A dystopian novel about totalitarianism and language.'],
            ['title' => 'Sherlock Holmes',      'author' => 'Arthur Conan Doyle',  'category' => 'Detective', 'rating' => 4.7, 'cover' => 'https://covers.openlibrary.org/b/id/8369868-L.jpg',  'description' => 'Complete adventures of the world\'s greatest detective.'],
            ['title' => 'Beautiful Ones',       'author' => 'Emily Hayse',         'category' => 'Fantasy',   'rating' => 4.2, 'cover' => 'https://covers.openlibrary.org/b/id/9255566-L.jpg',  'description' => 'An enchanting tale of beauty, power, and transformation.'],
        ];

        foreach ($books as $book) {
            Book::firstOrCreate(['title' => $book['title'], 'author' => $book['author']], $book);
        }
    }
}
