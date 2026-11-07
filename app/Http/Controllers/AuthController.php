<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    public function showLogin(): Response
    {
        return Inertia::render('Auth/Login', [
            'demoAccounts' => [
                [
                    'role' => 'Super Administrator',
                    'email' => 'admin@novaportal.io',
                    'badge' => 'Full Governance & RBAC',
                    'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
                ],
                [
                    'role' => 'Operations Manager',
                    'email' => 'manager@novaportal.io',
                    'badge' => 'Workflow & Approvals',
                    'avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
                ],
                [
                    'role' => 'Client / Portal User',
                    'email' => 'client@novaportal.io',
                    'badge' => 'Self-Service & Intake',
                    'avatar' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
                ],
            ]
        ]);
    }

    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();
            $user = Auth::user();

            if ($user->status === 'suspended') {
                Auth::logout();
                return back()->withErrors(['email' => 'Your account is suspended. Please contact enterprise support.']);
            }

            ActivityLogger::log('auth.login', "User {$user->name} logged in successfully.", $user);

            return redirect()->intended('/dashboard');
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }

    public function quickLogin(Request $request, string $role): RedirectResponse
    {
        $targetEmail = match ($role) {
            'super_admin' => 'admin@novaportal.io',
            'operations_manager' => 'manager@novaportal.io',
            'client_user' => 'client@novaportal.io',
            default => 'admin@novaportal.io',
        };

        $user = User::where('email', $targetEmail)->firstOrFail();
        Auth::login($user);
        $request->session()->regenerate();

        ActivityLogger::log('auth.quick_login', "Quick demo login as {$user->name} ({$role})", $user);

        return redirect('/dashboard');
    }

    public function sendOtp(Request $request)
    {
        $request->validate(['phone' => ['required', 'string']]);
        $phone = $request->input('phone');

        $user = User::where('phone', $phone)->first();
        if (!$user) {
            // Auto create client user if doesn't exist for seamless phone onboarding
            $user = User::create([
                'name' => 'Mobile User ' . substr($phone, -4),
                'email' => 'phone_' . preg_replace('/\D/', '', $phone) . '@novaportal.io',
                'phone' => $phone,
                'role' => 'client_user',
                'status' => 'active',
                'password' => Hash::make('password123'),
            ]);
        }

        // Mock 6-digit OTP
        $otp = '123456';
        $user->two_factor_code = $otp;
        $user->two_factor_expires_at = now()->addMinutes(10);
        $user->save();

        ActivityLogger::log('auth.otp_sent', "Sent OTP to {$phone}", $user);

        return response()->json([
            'success' => true,
            'message' => 'Verification code sent to ' . $phone,
            'demo_otp' => '123456', // surfaced for easy demo evaluation
        ]);
    }

    public function verifyOtp(Request $request): RedirectResponse
    {
        $request->validate([
            'phone' => ['required', 'string'],
            'otp' => ['required', 'string', 'size:6'],
        ]);

        $user = User::where('phone', $request->phone)->first();
        if (!$user || ($user->two_factor_code !== $request->otp && $request->otp !== '123456')) {
            return back()->withErrors(['otp' => 'Invalid or expired verification code. Use demo OTP: 123456']);
        }

        $user->two_factor_code = null;
        $user->save();

        Auth::login($user);
        $request->session()->regenerate();

        ActivityLogger::log('auth.otp_verified', "Verified OTP and logged in {$user->name}", $user);

        return redirect('/dashboard');
    }

    public function impersonate(Request $request, User $user): RedirectResponse
    {
        $admin = Auth::user();
        if (!$admin || !$admin->isSuperAdmin()) {
            abort(403, 'Unauthorized impersonation attempt.');
        }

        $request->session()->put('impersonator_id', $admin->id);
        Auth::login($user);

        ActivityLogger::log('user.impersonate_start', "Admin {$admin->name} started impersonating {$user->name}.", $user);

        return redirect('/dashboard')->with('success', "Now impersonating {$user->name} ({$user->role})");
    }

    public function revertImpersonation(Request $request): RedirectResponse
    {
        $impersonatorId = $request->session()->pull('impersonator_id');
        if ($impersonatorId) {
            $admin = User::find($impersonatorId);
            if ($admin) {
                $target = Auth::user();
                Auth::login($admin);
                ActivityLogger::log('user.impersonate_end', "Admin {$admin->name} stopped impersonating {$target?->name}.");
            }
        }

        return redirect('/dashboard')->with('success', 'Returned to your administrator account.');
    }

    public function logout(Request $request): RedirectResponse
    {
        $user = Auth::user();
        if ($user) {
            ActivityLogger::log('auth.logout', "User {$user->name} logged out.", $user);
        }

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login');
    }
}

