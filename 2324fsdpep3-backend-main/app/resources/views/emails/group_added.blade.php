<!DOCTYPE html>
<html>
<head>
    <title>You Have Been Added to a Group</title>
</head>
<body>
    <h1>Hello, {{ $user->firstname }}!</h1>
    <p>You have been added to the group "{{ $group->title }}" in the OPO "{{ $opo->name }}".</p>
    <p>To access the group and view more details, please log in using the link below:</p>
    <p><a href="{{ url('/login') }}">Login Here</a></p>
    <p>If you have any questions, feel free to reach out.</p>
    <p>Thank you!</p>
</body>
</html>