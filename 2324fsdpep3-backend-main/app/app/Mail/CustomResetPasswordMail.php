<?php
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CustomResetPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $resetUrl;

    public function __construct($user, $resetUrl)
    {
        $this->user = $user;
        $this->resetUrl = $resetUrl;
    }

    public function build()
    {
        return $this->view('emails.custom_reset_password')
            ->subject('Reset Password Notification')
            ->with([
                'resetUrl' => $this->resetUrl,
                'user' => $this->user,
            ]);
    }
}