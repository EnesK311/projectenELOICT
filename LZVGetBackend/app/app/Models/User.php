<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Casts\Attribute;
use App\Notifications\VerifyEmailCustom;


class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'team_id',
        'season_id',
        'number',
        'first_name',
        'last_name',
        'nickname',
        'email',
        'password',
        'uid',
        'games',
        'avg_against',
        'keeper_games',
        'role',
        'goals',
        'assists',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];


    public function team()
    {
        return $this->belongsTo(Team::class);
    }

    // Interact with the player's first name.
    protected function name(): Attribute
    {
        return Attribute::make(
            get: fn(mixed $value, array $attributes) => $attributes['first_name'] . ' ' . $attributes['last_name']
        );
    }

    // Role-based methods (example)
    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    public function isManager()
    {
        return $this->role === 'manager';
    }

    public function isPlayer()
    {
        return $this->role === 'player';
    }

    public function getKeyName()
    {
        return 'id';
    }

    public function generateEmailVerificationToken()
    {
        // Genereer een random token
        $plainToken = Str::random(60);

        // Hash het token voordat je het in de database bewaart, zodat als je DB uitlekt,
        // de tokens niet meteen bruikbaar zijn.
        $hashedToken = Hash::make($plainToken);

        $this->email_verification_token = $hashedToken;
        $this->email_verification_expires_at = now()->addMinutes(60); // bijvoorbeeld 60 minuten geldig
        $this->save();

        return $plainToken; // Deze ga je in de email sturen.
    }

    public function sendEmailVerification($verificationUrl)
    {
        $this->notify(new VerifyEmailCustom($verificationUrl));
    }

    public function availabilities()
    {
        return $this->hasMany(Availability::class);
    }
}