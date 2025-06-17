<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AssessmentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        // Determine the state based on the role
        $state = $this->determineState();

        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'teacher' => [
                'id' => $this->createdBy->id,
                'name' => $this->createdBy->firstname . ' ' . $this->createdBy->lastname,
            ],
            'opo' => [
                'id' => $this->opo->id,
                'name' => $this->opo->name,
            ],
            'end_date' => $this->end_date,
            'is_result_visible' => $this->is_result_visible,
            'state' => $state,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }

    /**
     * Determine the state based on the user's role.
     *
     * @return string
     */
    protected function determineState()
    {
        $userRole = auth()->user()->role;

        if (!$userRole) {
            return 'unknown';
        }

        if ($userRole === 'teacher' || $userRole === 'admin') {
            return $this->getStateTeacher($this->id);
        } elseif ($userRole === 'student') {
            return $this->getStateStudent($this->id);
        }

        return 'unknown';
    }


}