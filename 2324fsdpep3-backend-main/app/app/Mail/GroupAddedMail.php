<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class GroupAddedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $opo;
    public $group;

    public function __construct($user, $opo, $group)
    {
        $this->user = $user;
        $this->opo = $opo;
        $this->group = $group;
    }

    public function build()
    {
        return $this->view('emails.group_added')
            ->subject('You Have Been Added to a Group')
            ->with([
                'user' => $this->user,
                'opo' => $this->opo,
                'group' => $this->group,
            ]);
    }
}