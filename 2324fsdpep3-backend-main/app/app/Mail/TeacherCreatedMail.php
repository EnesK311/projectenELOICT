<?php
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class TeacherCreatedMail extends Mailable
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
        return $this->view('emails.teacher_created')
            ->subject('Hey Professor, Your Account Was Created')
            ->with([
                'resetUrl' => $this->resetUrl,
                'user' => $this->user,
            ]);
    }
}