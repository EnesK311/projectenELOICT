<!DOCTYPE html>
<html>
<head>
    <title>Assessment Reminder</title>
</head>
<body>
    <p>Dear {{ $user->name }},</p>

    <p>This is a reminder that the assessment <strong>{{ $assessment->title }}</strong> is due on {{ \Carbon\Carbon::parse($assessment->end_date)->toFormattedDateString() }}.</p>

    <p>Please make sure to complete any necessary tasks before the deadline.</p>

    <p>Best regards,<br>Your School Team</p>
</body>
</html>