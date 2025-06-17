<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;

class ScoreUpdated implements ShouldBroadcastNow
{
    use InteractsWithSockets, SerializesModels;

    public $matchId;
    public $homeTeamScore;
    public $awayTeamScore;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($matchId, $homeTeamScore, $awayTeamScore)
    {
        $this->matchId = $matchId;
        $this->homeTeamScore = $homeTeamScore;
        $this->awayTeamScore = $awayTeamScore;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new Channel('match-' . $this->matchId);
    }

    /**
     * Data to broadcast.
     *
     * @return array
     */
    public function broadcastWith()
    {
        return [
            'matchId' => $this->matchId,
            'homeTeamScore' => $this->homeTeamScore,
            'awayTeamScore' => $this->awayTeamScore,
        ];
    }
}