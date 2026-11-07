<?php

namespace App\Http\Controllers;

use App\Models\PortalRequest;
use App\Models\User;
use App\Services\AnalyticsTelemetryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        protected AnalyticsTelemetryService $analytics
    ) {}

    public function index(Request $request): Response
    {
        $user = Auth::user();
        $telemetry = $this->analytics->getExecutiveMetrics();

        if ($user->isSuperAdmin()) {
            return Inertia::render('Dashboard/AdminDashboard', [
                'telemetry' => $telemetry,
                'pendingRequests' => PortalRequest::with('client')
                    ->whereIn('status', ['pending_review', 'in_progress'])
                    ->latest()
                    ->take(5)
                    ->get(),
                'recentUsers' => User::latest()->take(5)->get(),
            ]);
        }

        if ($user->isOperationsManager()) {
            return Inertia::render('Dashboard/ManagerDashboard', [
                'telemetry' => $telemetry,
                'queue' => PortalRequest::with(['client', 'assignedManager'])
                    ->where('status', 'pending_review')
                    ->latest()
                    ->get(),
                'inProgress' => PortalRequest::with(['client', 'assignedManager'])
                    ->where('status', 'in_progress')
                    ->latest()
                    ->take(6)
                    ->get(),
            ]);
        }

        // Client User Dashboard
        return Inertia::render('Dashboard/ClientDashboard', [
            'myRequests' => PortalRequest::with(['assignedManager', 'transitions.actor'])
                ->where('client_id', $user->id)
                ->latest()
                ->get(),
            'stats' => [
                'total' => PortalRequest::where('client_id', $user->id)->count(),
                'pending' => PortalRequest::where('client_id', $user->id)->whereIn('status', ['draft', 'pending_review'])->count(),
                'active' => PortalRequest::where('client_id', $user->id)->where('status', 'in_progress')->count(),
                'completed' => PortalRequest::where('client_id', $user->id)->where('status', 'completed')->count(),
            ]
        ]);
    }

    /**
     * Upload and update official portal logos.
     */
    public function updateLogos(Request $request)
    {
        $request->validate([
            'bb_logo' => 'nullable|file|mimes:jpeg,png,jpg,gif,svg,webp,ico,avif|max:10240',
            'sicip_logo' => 'nullable|file|mimes:jpeg,png,jpg,gif,svg,webp,ico,avif|max:10240',
        ]);

        $uploadDir = public_path('uploads' . DIRECTORY_SEPARATOR . 'logos');
        if (!\Illuminate\Support\Facades\File::isDirectory($uploadDir)) {
            \Illuminate\Support\Facades\File::makeDirectory($uploadDir, 0777, true, true);
        }

        if ($request->hasFile('bb_logo')) {
            $file = $request->file('bb_logo');
            $ext = $file->getClientOriginalExtension() ?: 'png';
            $filename = 'bb_' . time() . '_' . \Illuminate\Support\Str::random(6) . '.' . $ext;
            \Illuminate\Support\Facades\File::put(
                $uploadDir . DIRECTORY_SEPARATOR . $filename,
                file_get_contents($file->getRealPath())
            );
            \App\Models\PortalSetting::set('bb_logo', '/uploads/logos/' . $filename);
        } elseif ($request->filled('bb_logo_base64')) {
            \App\Models\PortalSetting::set('bb_logo', $request->input('bb_logo_base64'));
        }

        if ($request->hasFile('sicip_logo')) {
            $file = $request->file('sicip_logo');
            $ext = $file->getClientOriginalExtension() ?: 'png';
            $filename = 'sicip_' . time() . '_' . \Illuminate\Support\Str::random(6) . '.' . $ext;
            \Illuminate\Support\Facades\File::put(
                $uploadDir . DIRECTORY_SEPARATOR . $filename,
                file_get_contents($file->getRealPath())
            );
            \App\Models\PortalSetting::set('sicip_logo', '/uploads/logos/' . $filename);
        } elseif ($request->filled('sicip_logo_base64')) {
            \App\Models\PortalSetting::set('sicip_logo', $request->input('sicip_logo_base64'));
        }

        if ($request->boolean('reset_bb_logo')) {
            \App\Models\PortalSetting::set('bb_logo', null);
        }

        if ($request->boolean('reset_sicip_logo')) {
            \App\Models\PortalSetting::set('sicip_logo', null);
        }

        return back()->with('success', 'ফর্মের লোগো সফলভাবে সংরক্ষিত হয়েছে!');
    }
}

