<?php

namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controller;
use App\Models\Book;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * GET /api/admin/dashboard
     * Returns stats summary for the admin panel.
     */
    public function dashboard()
    {
        $totalBooks    = Book::count();
        $totalUsers    = User::where('role', 'user')->count();
        $totalAdmins   = User::where('role', 'admin')->count();
        $categories    = Book::distinct()->pluck('category')->filter()->values();
        $recentBooks   = Book::orderByDesc('created_at')->limit(5)->get();
        $recentUsers   = User::where('role', 'user')
                             ->orderByDesc('created_at')
                             ->limit(5)
                             ->select('id', 'name', 'username', 'email', 'created_at')
                             ->get();

        return response()->json([
            'stats' => [
                'total_books'    => $totalBooks,
                'total_users'    => $totalUsers,
                'total_admins'   => $totalAdmins,
                'total_categories' => $categories->count(),
            ],
            'categories'   => $categories,
            'recent_books' => $recentBooks,
            'recent_users' => $recentUsers,
        ]);
    }

    /**
     * GET /api/admin/users
     */
    public function users(Request $request)
    {
        $users = User::withCount(['favorites', 'saved'])
                     ->orderByDesc('created_at')
                     ->paginate(20);

        return response()->json($users);
    }

    /**
     * DELETE /api/admin/users/{user}
     */
    public function deleteUser(User $user)
    {
        if ($user->isAdmin()) {
            return response()->json(['message' => 'لا يمكن حذف حساب أدمن'], 403);
        }

        $user->tokens()->delete();
        $user->delete();

        return response()->json(['message' => 'تم حذف المستخدم']);
    }
}
