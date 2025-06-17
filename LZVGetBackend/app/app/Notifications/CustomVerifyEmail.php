<?php
namespace App\Notifications;
use Illuminate\Auth\Notifications\VerifyEmail as VerifyEmailBase;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Log;
class CustomVerifyEmail extends VerifyEmailBase
{
    public function toMail($notifiable)
    {
        $verificationUrl = $this->verificationUrl($notifiable);
        // Intercept and log the verification URL
        Log::info('Verification URL: ' . $verificationUrl);
        // Capture the token from the URL (if needed for other purposes)
        $token = $this->extractTokenFromUrl($verificationUrl);
        Log::info('Verification Token: ' . $token);
        // You can now store the $token and $notifiable->id in your database if needed
        // Example:
        // DB::table('email_verification_tokens')->updateOrInsert(
        //     ['user_id' => $notifiable->getKey()],
        //     ['token' => $token, 'created_at' => now()]
        // );
        if (static::$toMailCallback) {
            return call_user_func(static::$toMailCallback, $notifiable, $verificationUrl);
        }
        return (new MailMessage)
            ->subject('Verify Email Address')
            ->line('Please click the button below to verify your email address.')
            ->action('Verify Email Address', $verificationUrl)
            ->line('If you did not create an account, no further action is required.');
    }
    protected function extractTokenFromUrl($url)
    {
        // Extract the token from the URL
        // This is a simple example and may need to be adjusted based on your URL structure
        $parts = explode('/', $url);
        return $parts[count($parts) - 2]; // Assuming the token is the second last part
    }
}
