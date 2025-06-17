<!DOCTYPE html>
<html>
<head>
    <title>An Account was created for you</title>
</head>
<body>
    <h1>Hello, {{ $user->firstname }}!</h1>
    <p>an account was created for you on: https://peer.eneskahya.ikdoeict.be/</p>
    <p>You were added to the group {{ $group->title }} </p>
      <p>for the OPO {{ $opo->name }}</p>  
    <p>If you have any questions, feel free to reach out.</p>


    <h2>Use this link to set your password and log in to your account</h2>
    <a href="{{ $resetUrl }}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none;">Reset Password</a>
   
    <p>Thank you!</p>
</body>
</html>