<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class Buyer extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'user_uuid',
        'seller_uuid',
        'buyer_uuid',
        'buyer_type',
    ];

    protected $hidden = [
        'id',
    ];

    protected static function booted()
    {
        static::creating(function ($buyer) {
            $buyer->uuid = (string) Str::uuid(); // Generate a UUID
        });
    }

    public function staff()
    {
        return $this->belongsTo(User::class, 'user_uuid', 'uuid');
    }

    public function seller()
    {
        return $this->belongsTo(Company::class, 'seller_uuid', 'uuid');
    }

    public function buyer()
    {
        if ($this->buyer_type === 'company') {
            return $this->belongsTo(Company::class, 'uuid', 'buyer_uuid');
        } elseif ($this->buyer_type === 'consumer') {
            return $this->belongsTo(Consumer::class, 'uuid', 'buyer_uuid');
        }
    }
}
