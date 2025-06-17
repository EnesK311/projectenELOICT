<!DOCTYPE html>
<html>
<head>
    <title>Reset Password</title>
</head>
<body>
    <h1>Hello, {{ $user->firstname }}!</h1>
    <p>You requested a password reset. Click the button below to reset your password:</p>
    <a href="{{ $resetUrl }}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none;">Reset Password</a>
    <p>If you did not request a password reset, you can safely ignore this email.</p>
</body>
</html>