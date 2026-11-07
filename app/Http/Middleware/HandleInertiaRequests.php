<?php

namespace App\Http\Middleware;

use App\Models\NotificationLog;
use App\Models\PortalSetting;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $impersonatorId = $request->session()->get('impersonator_id');
        $impersonator = $impersonatorId ? User::find($impersonatorId) : null;

        $unreadCount = 0;
        $recentNotifications = [];
        if ($user) {
            $unreadCount = NotificationLog::where('user_id', $user->id)
                ->whereNull('read_at')
                ->count();
            $recentNotifications = NotificationLog::where('user_id', $user->id)
                ->latest()
                ->take(5)
                ->get();
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'role' => $user->role,
                    'status' => $user->status,
                    'avatar' => $user->avatar,
                    'company_name' => $user->company_name,
                    'is_super_admin' => $user->isSuperAdmin(),
                    'is_operations_manager' => $user->isOperationsManager(),
                    'is_client' => $user->isClient(),
                ] : null,
                'impersonator' => $impersonator ? [
                    'id' => $impersonator->id,
                    'name' => $impersonator->name,
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'notifications' => [
                'unread_count' => $unreadCount,
                'recent' => $recentNotifications,
            ],
            'settings' => [
                'bb_logo' => PortalSetting::get('bb_logo'),
                'sicip_logo' => PortalSetting::get('sicip_logo'),
            ],
        ];
    }
}
