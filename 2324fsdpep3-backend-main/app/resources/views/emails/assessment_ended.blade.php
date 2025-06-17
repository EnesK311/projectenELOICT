<!DOCTYPE html>
<html>
<head>
    <title>Assessment Reminder</title>
</head>
<body>
    <p>Dear {{ $user->name }},</p>

    <p>You can see your results for the assessment<strong>{{ $assessment->title }}</strong>.</p>
    
    <p>Please make sure to complete any necessary tasks before the deadline.</p>

    <p>Best regards,<br>Your School Team</p>
</body>
</html>