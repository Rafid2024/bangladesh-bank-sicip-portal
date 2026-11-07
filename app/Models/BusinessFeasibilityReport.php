<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BusinessFeasibilityReport extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'submission_date' => 'date',
        'dob' => 'date',
        'trade_license_date' => 'date',
        'signature_date' => 'date',
        'reviewed_at' => 'datetime',
        'has_trade_license' => 'boolean',
        'has_own_house' => 'boolean',
        'present_address' => 'array',
        'permanent_address' => 'array',
        'education_history' => 'array',
        'training_history' => 'array',
        'experience_history' => 'array',
        'competitor_analysis' => 'array',
        'extra_attachments' => 'array',
        'avg_selling_price' => 'decimal:2',
        'daily_sales_amount' => 'decimal:2',
        'monthly_sales_amount' => 'decimal:2',
        'monthly_raw_operational_cost' => 'decimal:2',
        'monthly_estimated_profit' => 'decimal:2',
        'total_investment_amount' => 'decimal:2',
        'family_monthly_income' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }
}

