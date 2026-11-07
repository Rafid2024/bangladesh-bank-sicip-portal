<?php

use App\Http\Controllers\ApplicantAuthController;
use App\Http\Controllers\AuditLogsController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BusinessFeasibilityReportController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PortalRequestController;
use App\Http\Controllers\UserGovernanceController;
use Illuminate\Support\Facades\Route;

// Redirect root to feasibility report form or dashboard
Route::get('/', function () {
    return redirect()->route('sicip.create');
});

// SICIP Applicant Authentication (Login, Register & Logout)
Route::get('/sicip/login', [ApplicantAuthController::class, 'showLogin'])->name('sicip.login');
Route::post('/sicip/login', [ApplicantAuthController::class, 'login']);
Route::get('/sicip/register', [ApplicantAuthController::class, 'showRegister'])->name('sicip.register');
Route::post('/sicip/register', [ApplicantAuthController::class, 'register']);
Route::post('/sicip/logout', [ApplicantAuthController::class, 'logout'])->name('sicip.logout');

// SICIP Business Feasibility Report Portal (Public for Applicants)
Route::get('/sicip/feasibility-report', [BusinessFeasibilityReportController::class, 'create'])->name('sicip.create');
Route::post('/sicip/feasibility-report', [BusinessFeasibilityReportController::class, 'store'])->name('sicip.store');
Route::get('/sicip/sample-demo-pdf', [BusinessFeasibilityReportController::class, 'sampleDemo'])->name('sicip.sample.pdf');
Route::get('/sicip/report/{tracking_number}', [BusinessFeasibilityReportController::class, 'show'])->name('sicip.show');

// SICIP Admin Scrutiny & Management (Admin Only - Requires Login & Password)
Route::middleware(['admin'])->group(function () {
    Route::get('/sicip/reports', [BusinessFeasibilityReportController::class, 'index'])->name('sicip.index');
    Route::get('/sicip/report/{tracking_number}/profile', [BusinessFeasibilityReportController::class, 'profile'])->name('sicip.profile');
    Route::post('/sicip/report/{id}/status', [BusinessFeasibilityReportController::class, 'updateStatus'])->name('sicip.status.update');
    Route::delete('/sicip/report/{id}', [BusinessFeasibilityReportController::class, 'destroy'])->name('sicip.destroy');
});


// Guest Authentication Routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/auth/quick/{role}', [AuthController::class, 'quickLogin'])->name('auth.quick');
    Route::post('/auth/otp/send', [AuthController::class, 'sendOtp'])->name('auth.otp.send');
    Route::post('/auth/otp/verify', [AuthController::class, 'verifyOtp'])->name('auth.otp.verify');
});

// Authenticated Routes
Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    // Central Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Dynamic Data & CRUD Engine + State Machine
    Route::get('/requests', [PortalRequestController::class, 'index'])->name('requests.index');
    Route::post('/requests', [PortalRequestController::class, 'store'])->name('requests.store');
    Route::put('/requests/{portalRequest}', [PortalRequestController::class, 'update'])->name('requests.update');
    Route::delete('/requests/{portalRequest}', [PortalRequestController::class, 'destroy'])->name('requests.destroy');
    Route::post('/requests/{portalRequest}/transition', [PortalRequestController::class, 'transition'])->name('requests.transition');
    Route::post('/requests/bulk-action', [PortalRequestController::class, 'bulkAction'])->name('requests.bulk');

    // Payments & Invoices
    Route::get('/payments', [PaymentController::class, 'index'])->name('payments.index');
    Route::post('/payments/initiate', [PaymentController::class, 'initiate'])->name('payments.initiate');

    // Super Admin Governance
    Route::get('/admin/users', [UserGovernanceController::class, 'index'])->name('admin.users');
    Route::post('/admin/users/{targetUser}/status', [UserGovernanceController::class, 'toggleStatus'])->name('admin.users.status');
    Route::post('/admin/users/{targetUser}/role', [UserGovernanceController::class, 'updateRole'])->name('admin.users.role');
    Route::get('/admin/audit-logs', [AuditLogsController::class, 'index'])->name('admin.audit-logs');
    Route::post('/admin/settings/logos', [DashboardController::class, 'updateLogos'])->name('admin.settings.logos');

    // Impersonation
    Route::post('/auth/impersonate/{user}', [AuthController::class, 'impersonate'])->name('auth.impersonate');
    Route::post('/auth/impersonate/revert', [AuthController::class, 'revertImpersonation'])->name('auth.impersonate.revert');
});

// Webhook endpoint (CSRF excluded in bootstrap/app.php)
Route::post('/api/webhooks/{gateway}', [PaymentController::class, 'webhook'])->name('api.webhooks');
