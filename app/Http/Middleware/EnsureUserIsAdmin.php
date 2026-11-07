<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check()) {
            return redirect()->guest('/login')->with('error', 'আবেদন তালিকা ও ড্যাশবোর্ড দেখার জন্য অ্যাডমিন অ্যাকাউন্টে লগইন করুন।');
        }

        $user = Auth::user();

        if (!$user->isSuperAdmin() && !$user->isOperationsManager()) {
            abort(403, 'অননুমোদিত অ্যাক্সেস। গোপনীয়তা রক্ষার স্বার্থে কোনো আবেদনকারী আবেদনকারীদের তালিকা বা ড্যাশবোর্ড দেখতে পারবেন না।');
        }

        return $next($request);
    }
}
