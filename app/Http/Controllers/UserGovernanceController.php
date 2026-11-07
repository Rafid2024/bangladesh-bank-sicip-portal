<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class UserGovernanceController extends Controller
{
    public function index(Request $request): Response
    {
        $user = Auth::user();
        if (!$user->isSuperAdmin()) {
            abort(403, 'Access Governance restricted to Super Administrators.');
        }

        $query = User::query()->with('roles');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('company_name', 'like', "%{$search}%");
            });
        }

        if ($role = $request->input('role')) {
            $query->where('role', $role);
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $users = $query->latest()->paginate(10)->withQueryString();
        $roles = Role::with('permissions')->get();
        $permissions = Permission::all()->groupBy('group');

        return Inertia::render('Admin/Users', [
            'users' => $users,
            'roles' => $roles,
            'permissions' => $permissions,
            'filters' => $request->only(['search', 'role', 'status']),
        ]);
    }

    public function toggleStatus(Request $request, User $targetUser): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:active,suspended,pending_verification']
        ]);

        $prevStatus = $targetUser->status;
        $targetUser->status = $validated['status'];
        $targetUser->save();

        ActivityLogger::log(
            action: 'user.status_toggled',
            description: "User {$targetUser->name} status changed from {$prevStatus} to {$validated['status']}",
            subject: $targetUser
        );

        return back()->with('success', "Status updated for {$targetUser->name}.");
    }

    public function updateRole(Request $request, User $targetUser): RedirectResponse
    {
        $validated = $request->validate([
            'role' => ['required', 'in:super_admin,operations_manager,client_user']
        ]);

        $prev = $targetUser->role;
        $targetUser->role = $validated['role'];
        $targetUser->save();

        ActivityLogger::log(
            action: 'user.role_updated',
            description: "User {$targetUser->name} role updated from {$prev} to {$validated['role']}",
            subject: $targetUser
        );

        return back()->with('success', "Role updated for {$targetUser->name}.");
    }
}

