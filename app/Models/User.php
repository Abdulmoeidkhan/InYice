<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laratrust\Traits\HasRolesAndPermissions;
use App\Notifications\ResetPasswordLinkSPA;
use Illuminate\Notifications\Notifiable;
use Laratrust\Contracts\LaratrustUser;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Str;

class User extends Authenticatable implements LaratrustUser
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens, HasRolesAndPermissions;

    // // Disable auto-incrementing for the id field
    // public $incrementing = false;

    // // Specify that the primary key is a UUID
    // protected $keyType = 'string';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'uuid',
        'email',
        'password',
        'contact',
        'image', 
    ];

    /**
     * Send the password reset notification.
     *
     * @param  string  $token
     * @return void
     */
    public function sendPasswordResetNotification($token)
    {
        $this->notify(new ResetPasswordLinkSPA($token));
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'id',
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Generate UUID automatically on creation
    protected static function booted()
    {
        static::creating(function ($user) {
            // Generate a UUID if it's not already set
            if (!$user->uuid) {
                $user->uuid = (string) Str::uuid();
            }
        });
    }

    public function staff()
    {
        return $this->hasOne(Staff::class,'user_uuid', 'uuid');
    }

    public function consumer()
    {
        return $this->hasOne(Consumer::class,'user_uuid', 'uuid');
    }
}
