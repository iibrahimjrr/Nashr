<?php

namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controller;
use App\Models\Book;
use Illuminate\Http\Request;

class BookController extends Controller
{
    /**
     * GET /api/books
     */
    public function index(Request $request)
    {
        $query = Book::query();

        if ($request->filled('category') && $request->category !== 'All') {
            $query->where('category', $request->category);
        }

        if ($request->filled('search')) {
            $q = $request->search;
            $query->where(function ($q2) use ($q) {
                $q2->where('title',  'like', "%{$q}%")
                   ->orWhere('author', 'like', "%{$q}%");
            });
        }

        $books = $query->orderByDesc('created_at')->get();

        return response()->json(['books' => $books]);
    }

    /**
     * GET /api/books/{book}
     */
    public function show(Book $book)
    {
        return response()->json(['book' => $book]);
    }

    /**
     * POST /api/admin/books
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'title'       => 'required|string|max:200',
            'author'      => 'required|string|max:100',
            'category'    => 'required|string|max:50',
            'cover'       => 'nullable|url|max:500',
            'readlink'    => 'nullable|url|max:500',
            'description' => 'nullable|string|max:2000',
            'rating'      => 'nullable|numeric|min:0|max:5',
        ]);

        $book = Book::create($data);

        return response()->json([
            'message' => 'تم إضافة الكتاب بنجاح',
            'book'    => $book,
        ], 201);
    }

    /**
     * PUT /api/admin/books/{book}
     */
    public function update(Request $request, Book $book)
    {
        $data = $request->validate([
            'title'       => 'sometimes|string|max:200',
            'author'      => 'sometimes|string|max:100',
            'category'    => 'sometimes|string|max:50',
            'cover'       => 'nullable|url|max:500',
            'readlink'    => 'nullable|url|max:500',
            'description' => 'nullable|string|max:2000',
            'rating'      => 'nullable|numeric|min:0|max:5',
        ]);

        $book->update($data);

        return response()->json([
            'message' => 'تم تحديث الكتاب',
            'book'    => $book->fresh(),
        ]);
    }

    /**
     * DELETE /api/admin/books/{book}
     */
    public function destroy(Book $book)
    {
        $book->delete();

        return response()->json(['message' => 'تم حذف الكتاب']);
    }
}
