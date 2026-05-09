<?php

namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controller;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    /**
     * GET /api/user/profile
     */
    public function profile(Request $request)
    {
        $user = $request->user()->load(['favorites', 'saved']);

        return response()->json([
            'user' => $this->formatUser($user),
        ]);
    }

    /**
     * PUT /api/user/profile
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'name'  => 'sometimes|string|max:100',
            'email' => "sometimes|email|unique:users,email,{$user->id}",
        ]);

        $user->update($data);

        return response()->json([
            'message' => 'تم تحديث الملف الشخصي',
            'user'    => $this->formatUser($user->fresh()),
        ]);
    }

    /**
     * PUT /api/user/password
     */
    public function changePassword(Request $request)
    {
        $data = $request->validate([
            'current_password' => 'required|string',
            'password'         => 'required|string|min:6|confirmed',
        ]);

        $user = $request->user();

        if (! Hash::check($data['current_password'], $user->password)) {
            return response()->json(['message' => 'كلمة المرور الحالية غلط'], 422);
        }

        $user->update(['password' => $data['password']]);

        return response()->json(['message' => 'تم تغيير كلمة المرور بنجاح']);
    }

    /**
     * POST /api/user/avatar
     */
    public function uploadAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,webp|max:4096',
        ]);

        $user = $request->user();

        // Delete old avatar
        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }

        $path = $request->file('avatar')->store('avatars', 'public');
        $user->update(['avatar' => $path]);

        return response()->json([
            'message'    => 'تم رفع الصورة بنجاح',
            'avatar_url' => asset('storage/' . $path),
        ]);
    }

    /* ── Favorites ── */

    /** GET /api/user/favorites */
    public function favorites(Request $request)
    {
        $books = $request->user()->favorites()->orderByPivot('created_at', 'desc')->get();
        return response()->json(['favorites' => $books]);
    }

    /** POST /api/user/favorites/{book} */
    public function addFavorite(Request $request, Book $book)
    {
        $user = $request->user();

        if ($user->favorites()->where('book_id', $book->id)->exists()) {
            return response()->json(['message' => 'الكتاب موجود بالفعل في المفضلة'], 409);
        }

        $user->favorites()->attach($book->id);

        return response()->json(['message' => 'تم إضافة الكتاب للمفضلة'], 201);
    }

    /** DELETE /api/user/favorites/{book} */
    public function removeFavorite(Request $request, Book $book)
    {
        $request->user()->favorites()->detach($book->id);
        return response()->json(['message' => 'تم حذف الكتاب من المفضلة']);
    }

    /* ── Saved ── */

    /** GET /api/user/saved */
    public function saved(Request $request)
    {
        $books = $request->user()->saved()->orderByPivot('created_at', 'desc')->get();
        return response()->json(['saved' => $books]);
    }

    /** POST /api/user/saved/{book} */
    public function addSaved(Request $request, Book $book)
    {
        $user = $request->user();

        if ($user->saved()->where('book_id', $book->id)->exists()) {
            return response()->json(['message' => 'الكتاب محفوظ بالفعل'], 409);
        }

        $user->saved()->attach($book->id);

        return response()->json(['message' => 'تم حفظ الكتاب'], 201);
    }

    /** DELETE /api/user/saved/{book} */
    public function removeSaved(Request $request, Book $book)
    {
        $request->user()->saved()->detach($book->id);
        return response()->json(['message' => 'تم إزالة الكتاب من المحفوظات']);
    }

    /* ── Helpers ── */

    private function formatUser($user): array
    {
        return [
            'id'        => $user->id,
            'username'  => $user->username,
            'name'      => $user->name,
            'email'     => $user->email,
            'role'      => $user->role,
            'avatar'    => $user->avatar ? asset('storage/' . $user->avatar) : null,
            'favorites' => $user->favorites ?? [],
            'saved'     => $user->saved ?? [],
        ];
    }
}
