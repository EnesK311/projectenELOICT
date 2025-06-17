<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AccountCreatedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;

    public $resetUrl;

    public $opo;

    public $group;

    public function __construct($user, $resetUrl, $opo, $group)
    {
        $this->user = $user;
        $this->resetUrl = $resetUrl;
        $this->opo = $opo;
        $this->group = $group;
    }

    public function build()
    {
        return $this->view('emails.account_created')
            ->subject('An Account was created for you')
            ->with([
                'user' => $this->user,
                'resetUrl' => $this->resetUrl,
                'opo' => $this->opo,
                'group' => $this->group
            ]);
    }
}