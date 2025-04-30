<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ImageCollection extends Model
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
        'assoc_uuid',
        'belongs_to',
        'path',
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
        static::creating(function ($imageCollection) {
            $imageCollection->image_uuid = (string) Str::uuid(); // Generate a UUID
        });

        // static::creating(function ($company) {
        //     $company->code = strtoupper(Str::random(2)) . str_pad(mt_rand(0, 99999999), 8, '0', STR_PAD_LEFT);
        // });
    }
}
