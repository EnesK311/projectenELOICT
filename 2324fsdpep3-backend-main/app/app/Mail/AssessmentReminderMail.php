<?php
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AssessmentReminderMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $assessment;

    /**
     * Create a new message instance.
     *
     * @param $user
     * @param $assessment
     */
    public function __construct($user, $assessment)
    {
        $this->user = $user;
        $this->assessment = $assessment;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Reminder: Upcoming Assessment')
            ->view('emails.assessment_reminder');
    }
}