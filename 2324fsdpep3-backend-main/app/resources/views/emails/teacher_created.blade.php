<!DOCTYPE html>
<html>
<head>
    <title>Your Teacher Account was created</title>
</head>
<body>
    <h1>Hello, {{ $user->firstname }}!</h1>
    <p>an account was created for you on: https://peer.eneskahya.ikdoeict.be/</p>

    <h2>Use this link to set your password and log in to your account</h2>
    <a href="{{ $resetUrl }}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none;">Reset Password</a>
   
    <p>Thank you!</p>
</body>
</html>