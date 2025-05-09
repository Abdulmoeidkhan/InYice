<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Staff extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_uuid',
        'company_uuid',
        'designation',
        'email',
        'contact',
        'status',
        'wage',
        'timing',
        'remarks',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'id',
    ];

    // Optionally, generate UUID automatically when creating a company
    protected static function booted()
    {
        static::creating(function ($staff) {
            $staff->uuid = (string) Str::uuid(); // Generate a UUID
        });
    }


    public function user()
    {
        return $this->belongsTo(User::class, 'user_uuid', 'uuid');
    }
}
