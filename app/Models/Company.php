<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Company extends Model
{
    use HasFactory;
    // // Indicate that the primary key is not auto-incrementing
    // public $incrementing = false;

    // // Set the primary key type to UUID
    // protected $keyType = 'string';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'owner_uuid',
        'name',
        'display_name',
        'email',
        'contact',
        'image',
        'industry',
        'city',
        'address',
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
        static::creating(function ($company) {
            $company->uuid = (string) Str::uuid(); // Generate a UUID
            $company->owner_uuid = (string) Str::uuid(); // Generate a UUID
        });

        static::creating(function ($company) {
            $company->code = strtoupper(Str::random(2)) . str_pad(mt_rand(0, 99999999), 8, '0', STR_PAD_LEFT);
        });
    }

    /**
     * The consumer that belong to the companies.
     */
    public function consumer()
    {
        
        return $this->belongsToMany(Consumer::class, 'company_consumers', 'company_id', 'consumer_id');
    }

    /**
     * The Staff that belong to the companies.
     */
    public function staff()
    {
        return $this->hasOne(Staff::class, 'company_uuid', 'uuid');
    }
}
