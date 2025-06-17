<?php
namespace App\Notifications;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
class VerifyEmailCustom extends Notification
{
    private $verificationUrl;
    public function __construct($verificationUrl)
    {
        $this->verificationUrl = $verificationUrl;
    }
    public function via($notifiable)
    {
        return ['mail'];
    }
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Verify Your Email Address')
            ->line('Click the button below to verify your email address.')
            ->action('Verify Email', $this->verificationUrl)
            ->line('If you did not create an account, no further action is required.');
    }
}
